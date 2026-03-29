import { zodResolver } from "@hookform/resolvers/zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

import { FileUploader, Loader } from "@/components/shared";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@/components/ui";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queries";
import { PostValidation } from "@/lib/validation";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  // Queries
  const { mutateAsync: createPost, isLoading: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isLoading: isLoadingUpdate } =
    useUpdatePost();

  // Get geolocation
  const getGeolocation = (): Promise<{ lat: number; long: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Geolocation retrieved:', {
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
          resolve({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(error);
        }
      );
    });
  };

  // Handler
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    try {
      // Get geolocation data
      const { lat, long } = await getGeolocation();
      const geoLocation = { lat, long };
      console.log('GeoLocation:', geoLocation);

      // ACTION = UPDATE
      if (post && action === "Update") {
        const updatedPost = await updatePost({
          ...value,
          postId: post.$id,
          imageId: post.imageId,
          imageUrl: post.imageUrl,
          // Add geoLocation as a new attribute if your schema allows
          // Otherwise, you might want to combine this with the manual location
        });

        console.log('Update response:', updatedPost);

        if (!updatedPost) {
          toast({
            title: `${action} post failed. Please try again.`,
          });
        }
        return navigate(`/posts/${post.$id}`);
      }

      // ACTION = CREATE
      const newPost = await createPost({
        ...value,
        userId: user.id,
        // Store geolocation in the 'location' field or another suitable attribute
        location: JSON.stringify(geoLocation), // Combine with manual location if needed
      });

      console.log('Create response:', newPost);

      if (!newPost) {
        toast({
          title: `${action} post failed. Please try again.`,
        });
      }
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Failed to get location. Please try again.",
          description: error.message || "An unexpected error occurred.",
        });
      } else {
        toast({
          title: "Failed to get location. Please try again.",
          description: "An unexpected error occurred.",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Location (Your geolocation is collected automatically. You can still provide a manual location if desired.)
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}>
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
