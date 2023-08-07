import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { RefinementCtx } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/components/ui/use-toast";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { data } from 'autoprefixer';

const SignupUserFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: 'Name must be at least 2 characters.',
        })
        .max(50, {
            message: 'Name cannot be longer than 50 characters.',
        }),
    surname: z
        .string()
        .min(2, {
            message: 'Surname must be at least 2 characters.',
        })
        .max(50, {
            message: 'Surname cannot be longer than 50 characters.',
        }),
    username: z
        .string()
        .min(2, {
            message: 'Username must be at least 2 characters.',
        })
        .max(50, {
            message: 'Username cannot be longer than 50 characters.',
        }),
    email: z
        .string()
        .email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(50, { message: "Password must be no more than 50 characters long" })
        .refine(
            (val) => /[A-Z]/.test(val),
            { message: "Password must contain at least one uppercase letter" }
        )
        .refine(
            (val) => /[a-z]/.test(val),
            { message: "Password must contain at least one lowercase letter" }
        )
        .refine(
            (val) => /[0-9]/.test(val),
            { message: "Password must contain at least one number" }
        )
        .refine(
            (val) => /[^A-Za-z0-9]/.test(val),
            { message: "Password must contain at least one special character" }
        ),
    passwordConfirm: z.string()
}).superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords must match"
        });
    }
});

export default function SignUpForm() {
    const [showDialog, setShowDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { toast } = useToast();

    const SignupUserForm = useForm({
        resolver: zodResolver(SignupUserFormSchema),
        defaultValues: {
            name: '',
            surname: '',
            username: '',
            email: '',
            password: '',
            passwordConfirm: ''
        },
    });

    useEffect(() => {
        SignupUserForm.register("name");
        SignupUserForm.register("surname")
        SignupUserForm.register("username");
        SignupUserForm.register("email");
        SignupUserForm.register("password");
        SignupUserForm.register("passwordConfirm");
    }, []);

    async function openDialog() {
        try {
            await SignupUserForm.trigger();
            if (SignupUserForm.formState.isValid) {
                setShowDialog(true);
            } else {
                toast({
                    variant: "destructive",
                    title: "Validation Error!",
                    description: "Check the form and try again.",
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    function closeDialog() {
        setShowDialog(false);
    }

    async function confirmAction() {
        closeDialog();

        try {
            await SignupUserForm.handleSubmit(submitForm)();
        } catch (error) {
            console.error(error);
        }
    }

    async function submitForm(values) {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.baseUrl}Users/CreateUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            setIsSubmitting(false);
            const data = await response.json();

            if (data.succeeded) {
                SignupUserForm.reset();
                toast({
                    variant: "default",
                    title: "Successful!",
                    description: data.message,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error!",
                    description: data.message,
                });
                throw new Error(data.message);
            }
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <Form {...SignupUserForm}>
                <form className="space-y-3" onSubmit={SignupUserForm.handleSubmit(openDialog)}>
                    <FormField
                        control={SignupUserForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={SignupUserForm.control}
                        name="surname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Surname</FormLabel>
                                <FormControl>
                                    <Input placeholder="Surname" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={SignupUserForm.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={SignupUserForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type='email' placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={SignupUserForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={SignupUserForm.control}
                        name="passwordConfirm"
                        render={({ field, formState }) => (
                            <FormItem>
                                <FormLabel>Confirm password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Confirm password" {...field} />
                                </FormControl>
                                <FormMessage>
                                    {formState.errors.passwordConfirm && formState.errors.passwordConfirm.message}
                                </FormMessage>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting} onClick={openDialog}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </form>
            </Form>

            <AlertDialog open={showDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Terms of Services</AlertDialogTitle>
                        <AlertDialogDescription>
                            By signing up, you agree to terms of services.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeDialog}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmAction}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
