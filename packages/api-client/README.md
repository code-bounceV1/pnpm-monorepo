# @pnpm-monorepo/api-client

Axios-based API client with typed CRUD helpers and TanStack Query v5 hooks for the monorepo.

---

## Folder Structure

```
packages/api-client/
├── index.ts
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts
    ├── types.ts        # RequestOptions, CreateApiClientOptions
    ├── client.ts       # createApiClient
    ├── crud.ts         # createCrud (CRUD + multipart)
    ├── factory.ts      # createResourceClient (crud + all hooks)
    └── hooks/
        ├── index.ts
        ├── useQuery.ts         # createUseReadQuery, createUsePrefetch
        ├── useMutation.ts      # createUseMutations, createUploadMutations
        └── useInfiniteQuery.ts # createUseInfiniteReadQuery
```

---

## Installation

```json
{
  "dependencies": {
    "@pnpm-monorepo/api-client": "workspace:*"
  }
}
```

```bash
pnpm install
```

---

## Setup

### 1. Create your api client instance

```ts
// apps/my-app/lib/api.ts
import { createApiClient } from "@pnpm-monorepo/api-client";
import { firebaseAuth } from "@pnpm-monorepo/auth-mobile";

export const apiClient = createApiClient({
  baseURL: "https://your-api.com",
  configure: (instance) => {
    // attach firebase token to every request
    instance.interceptors.request.use(async (config) => {
      const token = await firebaseAuth.currentUser?.getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // handle 401 globally
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await firebaseAuth.signOut();
        }
        return Promise.reject(error);
      },
    );
  },
});
```

### 2. Wrap your app with QueryClientProvider

```tsx
// apps/my-app/app/_layout.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}
```

### 3. Create a resource client per feature

```ts
// apps/my-app/features/posts/postsClient.ts
import { createResourceClient } from "@pnpm-monorepo/api-client";
import { apiClient } from "@/lib/api";

export const postsClient = createResourceClient(apiClient);
```

`createResourceClient` binds all CRUD methods and TanStack Query hooks to the provided Axios instance. Each feature gets its own client instance.

```ts
postsClient.crud; // raw CRUD — use outside components
postsClient.useReadQuery; // GET
postsClient.usePrefetchQuery; // prefetch into cache
postsClient.useInfiniteReadQuery; // paginated GET
postsClient.useCreateMutation; // POST
postsClient.useUpdateMutation; // PUT
postsClient.usePatchMutation; // PATCH
postsClient.useDeleteMutation; // DELETE
postsClient.useUploadMutation; // POST multipart
postsClient.useUploadUpdateMutation; // PUT multipart
```

---

## Usage

### `useReadQuery` — fetch a resource

```tsx
interface Post {
  id: string;
  title: string;
  body: string;
}

// basic
const { data, isLoading, error } = postsClient.useReadQuery<Post[]>(
  ["posts"],
  "/posts",
);

// with query params
const { data } = postsClient.useReadQuery<Post[]>(
  ["posts", { status: "published" }],
  "/posts",
  { requestOptions: { params: { status: "published" } } },
);

// single resource
const { data: post } = postsClient.useReadQuery<Post>(
  ["posts", id],
  `/posts/${id}`,
);
```

---

### `useCreateMutation` — POST

```tsx
type CreatePostInput = { title: string; body: string };

const { mutate, isPending } = postsClient.useCreateMutation<
  Post,
  CreatePostInput
>("/posts", {
  invalidateKeys: [["posts"]], // auto-refetch posts list on success
  onSuccess: (post) => console.log("Created:", post.id),
  onError: (err) => console.error(err.message),
});

mutate({ title: "Hello", body: "World" });
```

---

### `useUpdateMutation` — PUT

```tsx
const { mutate: update } = postsClient.useUpdateMutation<Post, Partial<Post>>(
  `/posts/${id}`,
  { invalidateKeys: [["posts"], ["posts", id]] },
);

update({ title: "New Title", body: "New Body" });
```

---

### `usePatchMutation` — PATCH

```tsx
const { mutate: patch } = postsClient.usePatchMutation<Post, Partial<Post>>(
  `/posts/${id}`,
  { invalidateKeys: [["posts", id]] },
);

patch({ title: "Updated Title" });
```

---

### `useDeleteMutation` — DELETE

```tsx
const { mutate: remove, isPending } = postsClient.useDeleteMutation<void>(
  `/posts/${id}`,
  { invalidateKeys: [["posts"]] },
);

remove();
```

---

### `useUploadMutation` — POST multipart

```tsx
const { mutate: upload, isPending } = postsClient.useUploadMutation<Post>(
  "/posts/avatar",
  {
    invalidateKeys: [["posts"]],
    onSuccess: (post) => console.log("Uploaded:", post.id),
  },
);

const formData = new FormData();
formData.append("file", {
  uri: imageUri,
  name: "avatar.jpg",
  type: "image/jpeg",
} as unknown as Blob);

upload(formData);
```

### `useUploadUpdateMutation` — PUT multipart

```tsx
const { mutate: uploadUpdate } = postsClient.useUploadUpdateMutation<Post>(
  `/posts/${id}/avatar`,
  { invalidateKeys: [["posts", id]] },
);

uploadUpdate(formData);
```

### Upload with progress tracking

```tsx
const { mutate: upload } = postsClient.useUploadMutation<Post>(
  "/posts/avatar",
  {
    config: {
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / (e.total ?? 1));
        console.log(`Upload: ${percent}%`);
      },
    },
  },
);
```

---

### `useInfiniteReadQuery` — paginated list

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
  postsClient.useInfiniteReadQuery<Post>(["posts", "infinite"], "/posts", {
    limit: 20,
  });

const posts = data?.pages.flatMap((page) => page.data) ?? [];

return (
  <FlatList
    data={posts}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <Text>{item.title}</Text>}
    onEndReached={() => hasNextPage && fetchNextPage()}
    onEndReachedThreshold={0.5}
    ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
  />
);
```

> Your API must return `{ data: TItem[], nextPage?: number, total?: number }`.
> When `nextPage` is `undefined`, pagination stops.

---

### `usePrefetchQuery` — prefetch on focus

```tsx
const prefetch = postsClient.usePrefetchQuery<Post>(
  ["posts", id],
  `/posts/${id}`,
);

<Pressable onHoverIn={prefetch()} onPress={() => router.push(`/posts/${id}`)}>
  <Text>View Post</Text>
</Pressable>;
```

---

### Using `crud` directly — outside components

```ts
const post = await postsClient.crud.read<Post>(`/posts/${id}`);
const created = await postsClient.crud.create<Post, CreatePostInput>("/posts", {
  body: { title: "Hello", body: "World" },
});
await postsClient.crud.upload<Post>("/posts/avatar", formData);
```

---

## With Redux alert slice

```tsx
import { useAppDispatch } from "@/store/hooks";
import { setLoading, setError, setSuccess } from "@pnpm-monorepo/store";

const dispatch = useAppDispatch();

const { mutate } = postsClient.useCreateMutation<Post, CreatePostInput>(
  "/posts",
  {
    onMutate: () => dispatch(setLoading()),
    onSuccess: () => dispatch(setSuccess("Post created!")),
    onError: (err) => dispatch(setError(err.message)),
  },
);
```

---

## Full Feature Example

### 1. Create the client

```ts
// features/posts/postsClient.ts
import { createResourceClient } from "@pnpm-monorepo/api-client";
import { apiClient } from "@/lib/api";

export const postsClient = createResourceClient(apiClient);
```

### 2. Types

```ts
// features/posts/types.ts
export interface Post {
  id: string;
  title: string;
  body: string;
}
export type CreatePostInput = Omit<Post, "id">;
export type UpdatePostInput = Partial<CreatePostInput>;
```

### 3. Components

```tsx
// PostsList.tsx
export function PostsList() {
  const {
    data: posts,
    isLoading,
    error,
  } = postsClient.useReadQuery<Post[]>(["posts"], "/posts");

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>{error.message}</Text>;
  return posts?.map((post) => <Text key={post.id}>{post.title}</Text>);
}

// CreatePost.tsx
export function CreatePost() {
  const { mutate, isPending } = postsClient.useCreateMutation<
    Post,
    CreatePostInput
  >("/posts", { invalidateKeys: [["posts"]] });
  return (
    <Button
      title={isPending ? "Creating..." : "Create Post"}
      onPress={() => mutate({ title: "Hello", body: "World" })}
    />
  );
}

// EditPost.tsx
export function EditPost({ id }: { id: string }) {
  const { data: post } = postsClient.useReadQuery<Post>(
    ["posts", id],
    `/posts/${id}`,
  );
  const { mutate: patch } = postsClient.usePatchMutation<Post, UpdatePostInput>(
    `/posts/${id}`,
    { invalidateKeys: [["posts"], ["posts", id]] },
  );
  const { mutate: remove } = postsClient.useDeleteMutation<void>(
    `/posts/${id}`,
    { invalidateKeys: [["posts"]] },
  );

  return (
    <>
      <Text>{post?.title}</Text>
      <Button title="Update" onPress={() => patch({ title: "Updated" })} />
      <Button title="Delete" onPress={() => remove()} />
    </>
  );
}

// UploadAvatar.tsx
export function UploadAvatar() {
  const { mutate: upload, isPending } = postsClient.useUploadMutation<Post>(
    "/posts/avatar",
    { invalidateKeys: [["posts"]] },
  );

  const handlePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      const formData = new FormData();
      formData.append("file", {
        uri: result.assets[0].uri,
        name: "avatar.jpg",
        type: "image/jpeg",
      } as unknown as Blob);
      upload(formData);
    }
  };

  return (
    <Button
      title={isPending ? "Uploading..." : "Upload Avatar"}
      onPress={handlePick}
    />
  );
}
```

---

## API Reference

| Export                    | Description                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| `createApiClient`         | Creates an Axios instance with base config and interceptor support |
| `createCrud`              | Creates typed CRUD + multipart methods bound to an Axios instance  |
| `createResourceClient`    | Creates CRUD + all TanStack Query hooks bound to an Axios instance |
| `useReadQuery`            | `useQuery` wrapper for GET requests                                |
| `usePrefetchQuery`        | Prefetches a query into the cache                                  |
| `useInfiniteReadQuery`    | `useInfiniteQuery` wrapper for paginated GET requests              |
| `useCreateMutation`       | `useMutation` wrapper for POST requests                            |
| `useUpdateMutation`       | `useMutation` wrapper for PUT requests                             |
| `usePatchMutation`        | `useMutation` wrapper for PATCH requests                           |
| `useDeleteMutation`       | `useMutation` wrapper for DELETE requests                          |
| `useUploadMutation`       | `useMutation` wrapper for POST multipart requests                  |
| `useUploadUpdateMutation` | `useMutation` wrapper for PUT multipart requests                   |
