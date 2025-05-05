"use client"; //Needed because we use client-side features
// like React hooks and Firebase Auth here.

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormFields from "./FormFields";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/app/firebase/clients";
import { SignIn, SignUp } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};
const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;

        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await SignUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully, Please sign-in");
        router.push("./sign-in");
      } else {
        const { email, password } = values;
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await userCredentials.user.getIdToken();
        if (!idToken) {
          return {
            success: false,
            message: "user does not exist, please sign up",
          };
        }
        await SignIn({
          email,
          idToken,
        });
        toast.success("Sign-in succussfully");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error : ${error}`);
    }
    console.log(values);
  }

  //   check form type
  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10 text-center">
        <div className="flex flex-row gap-2 justify-center">
          <Link href="/">
            <Image
              src="./logo.svg"
              width={38}
              height={32}
              alt="Interview-logo"
            />
          </Link>
          <h3 className="text-primary-100">PrepWise</h3>
        </div>
        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form "
          >
            {!isSignIn && (
              <FormFields
                control={form.control}
                type="text"
                name="name"
                label="Name"
                placeholder="Enter your name"
              />
            )}
            <FormFields
              control={form.control}
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email address"
            />
            <FormFields
              control={form.control}
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
            />

            <Button type="submit" className="btn">
              {isSignIn ? "Sign in" : "Create an Account"}
            </Button>
          </form>

          <p className="text-center mt-2">
            {isSignIn ? "No account yet?" : "Have an account already"}
            <Link className="ml-2" href={isSignIn ? "/sign-up" : "/sign-in"}>
              {" "}
              {isSignIn ? "Sign Up" : "Sign in"}
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default AuthForm;
