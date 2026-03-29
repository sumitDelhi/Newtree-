import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";

import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { useUserContext } from "@/context/AuthContext";
import { useSignInAccount } from "@/lib/react-query/queries";
import { SigninValidation } from "@/lib/validation";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  // Query
  const { mutateAsync: signInAccount, isLoading } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    const session = await signInAccount(user);

    if (!session) {
      toast({ title: "Login failed. Please try again." });
      
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
  };

  return (
    <Form {...form}>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        //style={{ backgroundImage: `url(/assets/images/TREE-SIGNUP.jpg)` }} // Same image as SignupForm
      >
        <div
          className="w-full max-w-3xl p-12 rounded-lg shadow-lg space-y-8"
          style={{ backgroundColor: '#e6ffe6' }} // Same color as SignupForm
        >
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-green-900">Log in to your account</h2>
            <p className="text-green-700 mt-2 text-lg">Welcome back! Please enter your details.</p>
          </div>
          <form className="space-y-8" onSubmit={form.handleSubmit(handleSignin)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-green-700 text-lg">Email</FormLabel>
                  <FormControl>
                    <Input type="text" className="w-full p-4 mt-2 bg-green-200 rounded-md text-green-900 focus:ring-2 focus:ring-green-500 text-lg" {...field} />
                  </FormControl>
                  <FormMessage className="text-green-700" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-green-700 text-lg">Password</FormLabel>
                  <FormControl>
                    <Input type="password" className="w-full p-4 mt-2 bg-green-200 rounded-md text-green-900 focus:ring-2 focus:ring-green-500 text-lg" {...field} />
                  </FormControl>
                  <FormMessage className="text-green-700" />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full p-4 mt-2 bg-green-600 rounded-md text-white text-lg">
              {isLoading || isUserLoading ? (
                <div className="flex-center gap-2">
                  <Loader /> Loading...
                </div>
              ) : (
                "Log in"
              )}
            </Button>

            <p className="text-green-700 text-center mt-6 text-lg">
              Don&apos;t have an account? <Link to="/sign-up" className="text-green-600">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </Form>
  );
};

export default SigninForm;
