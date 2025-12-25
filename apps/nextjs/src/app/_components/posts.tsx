"use client";

import type { RouterOutputs } from "@finchat/api";
import { CreatePostSchema } from "@finchat/db/schema";
import { cn } from "@finchat/ui";
import { Button } from "@finchat/ui/button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@finchat/ui/field";
import { Input } from "@finchat/ui/input";
import { toast } from "@finchat/ui/toast";
import { useForm } from "@tanstack/react-form";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export function CreatePostForm() {
	const trpc = useTRPC();

	const queryClient = useQueryClient();
	const createPost = useMutation(
		trpc.post.create.mutationOptions({
			onError: (err) => {
				toast.error(
					err.data?.code === "UNAUTHORIZED"
						? "You must be logged in to post"
						: "Failed to create post",
				);
			},
			onSuccess: async () => {
				form.reset();
				await queryClient.invalidateQueries(trpc.post.pathFilter());
			},
		}),
	);

	const form = useForm({
		defaultValues: {
			content: "",
			title: "",
		},
		onSubmit: (data) => createPost.mutate(data.value),
		validators: {
			onSubmit: CreatePostSchema,
		},
	});

	return (
		<form
			className="w-full max-w-2xl"
			onSubmit={(event) => {
				event.preventDefault();
				void form.handleSubmit();
			}}
		>
			<FieldGroup>
				<form.Field name="title">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldContent>
									<FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
								</FieldContent>
								<Input
									aria-invalid={isInvalid}
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Title"
									value={field.state.value}
								/>
								{isInvalid ? (
									<FieldError errors={field.state.meta.errors} />
								) : null}
							</Field>
						);
					}}
				</form.Field>
				<form.Field name="content">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldContent>
									<FieldLabel htmlFor={field.name}>Content</FieldLabel>
								</FieldContent>
								<Input
									aria-invalid={isInvalid}
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Content"
									value={field.state.value}
								/>
								{isInvalid ? (
									<FieldError errors={field.state.meta.errors} />
								) : null}
							</Field>
						);
					}}
				</form.Field>
			</FieldGroup>
			<Button type="submit">Create</Button>
		</form>
	);
}

export function PostList() {
	const trpc = useTRPC();
	const { data: posts } = useSuspenseQuery(trpc.post.all.queryOptions());

	if (posts.length === 0) {
		return (
			<div className="relative flex w-full flex-col gap-4">
				<PostCardSkeleton pulse={false} />
				<PostCardSkeleton pulse={false} />
				<PostCardSkeleton pulse={false} />

				<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
					<p className="font-bold text-2xl text-white">No posts yet</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col gap-4">
			{posts.map((p) => (
				<PostCard key={p.id} post={p} />
			))}
		</div>
	);
}

export function PostCard(props: {
	post: RouterOutputs["post"]["all"][number];
}) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const deletePost = useMutation(
		trpc.post.delete.mutationOptions({
			onError: (err) => {
				toast.error(
					err.data?.code === "UNAUTHORIZED"
						? "You must be logged in to delete a post"
						: "Failed to delete post",
				);
			},
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.post.pathFilter());
			},
		}),
	);

	return (
		<div className="flex flex-row rounded-lg bg-muted p-4">
			<div className="grow">
				<h2 className="font-bold text-2xl text-primary">{props.post.title}</h2>
				<p className="mt-2 text-sm">{props.post.content}</p>
			</div>
			<div>
				<Button
					className="cursor-pointer font-bold text-primary text-sm uppercase hover:bg-transparent hover:text-white"
					onClick={() => deletePost.mutate(props.post.id)}
					variant="ghost"
				>
					Delete
				</Button>
			</div>
		</div>
	);
}

export function PostCardSkeleton(props: { pulse?: boolean }) {
	const { pulse = true } = props;
	return (
		<div className="flex flex-row rounded-lg bg-muted p-4">
			<div className="grow">
				<h2
					className={cn(
						"w-1/4 rounded-sm bg-primary font-bold text-2xl",
						pulse && "animate-pulse",
					)}
				>
					&nbsp;
				</h2>
				<p
					className={cn(
						"mt-2 w-1/3 rounded-sm bg-current text-sm",
						pulse && "animate-pulse",
					)}
				>
					&nbsp;
				</p>
			</div>
		</div>
	);
}
