import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { 
    Form,
    FormControl,
    FormField,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form"
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";
import { sendBugReport } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { boolean } from "zod";

export const BugReportModal = ({state, toggleState}: {state: boolean, toggleState: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const setState = (state: boolean) => {
        form.reset({title: '', description: ''})
        toggleState(state)
    }
    const form = useForm({
        defaultValues: {
            'title': '',
            'description': ''
        }
    });
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const handleSubmit = () => {
        try {
            setLoading(true)
            const title = form.getValues('title')
            const description = form.getValues('description')
            sendBugReport(title, description)
                .then((res) => {
                    if(res.error){
                        toast({
                            variant: "destructive",
                            title: "Uh oh! Something went wrong.",
                            description: "There was a problem sending the bug report. Please try again",
                        })
                        setLoading(false)
                    }
                    if(res.success){
                        toast({
                            title: "Thank you!",
                            description: "Your bug report has been sent. We'll get back to you shortly.",
                        })
                        form.reset({title: '', description: ''})
                        setState(false)
                        setLoading(false)
                    }
                })
        } catch {

            setLoading(false)
        }
    }
    return (
        <Dialog open={state} onOpenChange={setState}>
            <DialogContent className="h-screen sm:h-auto flex flex-col">
            <DialogHeader>
                <DialogTitle>Report a bug</DialogTitle>
                <DialogDescription>If you find any bugs using Concord, please report them here</DialogDescription>
            </DialogHeader>
               <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            type="text"
                                            placeholder=""
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        A short, descriptive title.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={loading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                       Please describe the bug in maximum detail and how to reproduce it.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={loading} className="w-full bg-orange-500 hover:bg-orange-400" type="submit">Submit bug report</Button>
                    </form>
               </Form>
            </DialogContent>
        </Dialog>
    )
}