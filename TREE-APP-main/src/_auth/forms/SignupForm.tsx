import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";

import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

import { useUserContext } from "@/context/AuthContext";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries";
import { SignupValidation } from "@/lib/validation";

// Import the image
//import treeSignUpImage from "@/assets/images/TREE-SIGNUP.jpg";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // Queries
  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } = useSignInAccount();

  // Handler
  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(user);

      if (!newUser) {
        toast({ title: "Sign up failed. Please try again." });
        return;
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({ title: "Something went wrong. Please login your new account" });
        navigate("/sign-in");
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();
        navigate("/");
      } else {
        toast({ title: "Login failed. Please try again." });
        return;
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Form {...form}>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        //style={{ backgroundImage: `url(${treeSignUpImage})` }}
      >
        <div
          className="w-full max-w-4xl p-8 rounded-lg shadow-md space-y-6"
          style={{ backgroundColor: '#e6ffe6' }}
        >
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-green-900">🌱NewTree🌱</h1>
            <h2 className="text-2xl font-bold text-green-900 mt-2">Create a new account</h2>
            <p className="text-green-700 mt-1">To use NewTree, please enter your details</p>
          </div>
          <form className="space-y-6" onSubmit={form.handleSubmit(handleSignup)}>
            <div>
              <label className="block text-green-700">Name</label>
              <input
                type="text"
                className="w-full p-3 mt-1 bg-green-200 rounded-md text-green-900 focus:ring-2 focus:ring-green-500"
                {...form.register("name")}
              />
            </div>
            <div>
              <label className="block text-green-700">Username</label>
              <input
                type="text"
                className="w-full p-3 mt-1 bg-green-200 rounded-md text-green-900 focus:ring-2 focus:ring-green-500"
                {...form.register("username")}
              />
            </div>
            <div>
              <label className="block text-green-700">Email</label>
              <input
                type="email"
                className="w-full p-3 mt-1 bg-green-200 rounded-md text-green-900 focus:ring-2 focus:ring-green-500"
                {...form.register("email")}
              />
            </div>
            <div>
              <label className="block text-green-700">Password</label>
              <input
                type="password"
                className="w-full p-3 mt-1 bg-green-200 rounded-md text-green-900 focus:ring-2 focus:ring-green-500"
                {...form.register("password")}
              />
            </div>
            <div>
              <Button type="submit" className="w-full p-3 mt-1 bg-green-600 rounded-md text-white">
                {isCreatingAccount || isSigningInUser || isUserLoading ? (
                  <div className="flex-center gap-2">
                    <Loader /> Loading...
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>
          <p className="text-green-700 text-center mt-4">
            Already have an account? <Link to="/login" className="text-green-600">Log in</Link>
          </p>
        </div>
      </div>
    </Form>
  );
};

export default SignupForm;
