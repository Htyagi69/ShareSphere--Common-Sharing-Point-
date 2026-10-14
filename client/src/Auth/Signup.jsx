"use client";
import React, { useContext } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { AuthProvider } from "@/components/Context";
import { toast } from "sonner";

export function Signup() {
  const { setIsAuthenticated, setUsername, theme } = useContext(AuthProvider);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    const formdata = new FormData(e.target);
    const data = Object.fromEntries(formdata.entries());
    console.log("Sending data:", data);
    const signupURI = `${import.meta.env.VITE_API_BASE_URL}/auth/signup`;
    
    try {
      const res = await fetch(signupURI, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      const response = await res.json();
      
      if (res.ok) {
        setIsAuthenticated(true);
        setUsername(response.userName);
        localStorage.setItem("token", response.token);
        console.log("message=>", response.message);
        toast.success("Welcome to ShareSphere", { position: "bottom-right" });
      } else {
        toast.error(`${response.message || "Signup failed"}`);
      }
    } catch (err) {
      console.error("Signup failed", err);
      toast.error(`Network error. Is your server running?`);
    }
  };

  const handleGoogleAuth = async () => {
    const authURI = `${import.meta.env.VITE_API_BASE_URL}/auth`;
    window.location.href = authURI;
  };

  return (
    <div className={cn(
      "min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-300",
      theme ? "bg-zinc-950 text-white" : "bg-slate-50 text-slate-900"
    )}>
    <div className={cn(
        "shadow-input mx-auto w-full max-w-md rounded-none p-4 md:rounded-2xl md:p-8 transition-colors duration-300",
        theme 
          ? "bg-zinc-950 text-white border border-zinc-800 " 
          : "bg-white text-slate-900 border border-slate-200"
      )}
    >
      <h2 className={cn("text-2xl font-black tracking-tight", theme ? "text-white" : "text-neutral-900")}>
        Welcome to <span className="text-green-500">ShareSphere</span>
      </h2>
      <p className={cn("mt-2 max-w-sm text-sm font-medium", theme ? "text-zinc-400" : "text-neutral-500")}>
        Sign up to access your secure lockers, manage files, and collaborate effortlessly.
      </p>

      <form className="my-8" method="POST" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label className={theme ? "text-zinc-300" : "text-neutral-700"} htmlFor="firstname">
              First name
            </Label>
            <Input 
              id="firstname" 
              name="firstname" 
              placeholder="Tyler" 
              type="text" 
              className={theme ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-green-500" : ""}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label className={theme ? "text-zinc-300" : "text-neutral-700"} htmlFor="lastname">
              Last name
            </Label>
            <Input 
              id="lastname" 
              name="lastname" 
              placeholder="Durden" 
              type="text" 
              className={theme ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-green-500" : ""}
            />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          <Label className={theme ? "text-zinc-300" : "text-neutral-700"} htmlFor="email">
            Email Address
          </Label>
          <Input 
            id="email" 
            name="email" 
            placeholder="projectmayhem@fc.com" 
            type="email" 
            className={theme ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-green-500" : ""}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label className={theme ? "text-zinc-300" : "text-neutral-700"} htmlFor="password">
            Password
          </Label>
          <Input 
            id="password" 
            name="password" 
            placeholder="••••••••" 
            type="password" 
            className={theme ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-green-500" : ""}
          />
        </LabelInputContainer>

        <button
          className={cn(
            "group/btn relative block h-10 w-full rounded-xl font-bold shadow transition-all cursor-pointer",
            theme 
              ? "bg-green-500 text-zinc-950 hover:bg-green-400" 
              : "bg-slate-900 text-white hover:bg-slate-800"
          )}
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className={cn("mt-4 text-xs font-medium", theme ? "text-zinc-400" : "text-neutral-600")}>
          Already have an account? <a href="/login" className="text-green-500 font-bold hover:underline">Login</a>
        </div>

        <div
          className={cn(
            "my-8 h-px w-full bg-linear-to-r from-transparent to-transparent",
            theme ? "via-zinc-800" : "via-neutral-300"
          )}
        />

        <div className="flex flex-col space-y-3">
          <button
            className={cn(
              "group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-xl px-4 font-medium transition-colors cursor-pointer",
              theme 
                ? "bg-zinc-900 text-zinc-200 border border-zinc-800 hover:bg-zinc-800/80" 
                : "bg-gray-50 text-black border border-gray-200 hover:bg-gray-100"
            )}
            type="button"
          >
            <IconBrandGithub className="h-4 w-4" />
            <span className="text-sm">GitHub</span>
            <BottomGradient />
          </button>

          <button
            className={cn(
              "group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-xl px-4 font-medium transition-colors cursor-pointer",
              theme 
                ? "bg-zinc-900 text-zinc-200 border border-zinc-800 hover:bg-zinc-800/80" 
                : "bg-gray-50 text-black border border-gray-200 hover:bg-gray-100"
            )}
            type="button" 
            onClick={handleGoogleAuth}
          >
            <IconBrandGoogle className="h-4 w-4" />
            <span className="text-sm">Google</span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
</div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};