"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect } from "react";
import {
  OkidoTokenAbi,
  okidoFinance,
  okidoFinanceAbi,
  okidoToken,
} from "@/constants";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { parseUnits } from "viem";

interface InvestModalProps {
  children: React.ReactNode;
}
const BuySharesModal = ({ children }: InvestModalProps) => {
  const {
    data: hash,
    error,
    isPending,
    writeContractAsync,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirming) {
      toast.loading("Transaction Pending");
    }
    if (isConfirmed) {
      toast.success("Transaction Successful", {
        action: {
          label: "View on Etherscan",
          onClick: () => {
            window.open(`https://explorer-holesky.morphl2.io/tx/${hash}`);
          },
        },
      });
    }
    if (error) {
      toast.error("Transaction Failed");
    }
  }, [isConfirming, isConfirmed, error, hash]);

  const formSchema = z.object({
    // ensure to enforce validation regarding symbol and others
    propertyId: z.any(),
    shares: z.any(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyId: 0,
      shares: 0,
    },
  });

  const BuyShares = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    try {
      const approveSharesTx = await writeContractAsync({
        address: okidoToken,
        abi: OkidoTokenAbi,
        functionName: "approve",
        args: [okidoFinance, parseUnits("100000000", 18)],
      });

      console.log("property transaction hash:", approveSharesTx);

      const buySharesTx = await writeContractAsync({
        address: okidoFinance,
        abi: okidoFinanceAbi,
        functionName: "buyShares",
        args: [data.propertyId, data.shares],
      });

      console.log("property transaction hash:", buySharesTx);
    } catch (err: any) {
      toast.error("Transaction Failed: " + err.message);
      console.log("Transaction Failed: " + err.message);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex items-center gap-6 justify-center">
              <AlertDialogCancel className="border-none">
                <MoveLeft size={24} />
              </AlertDialogCancel>
              <h1>Add a Property</h1>
            </div>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(BuyShares)} className="space-y-8">
              <FormField
                control={form.control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">
                      <h1 className="text-[#32393A]">Property Id</h1>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-full"
                        type="number"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">
                      <h1 className="text-[#32393A]">No of shares</h1>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-full"
                        type="number"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="bg-[#007A86] self-center my-8 rounded-full w-full"
                size="lg"
                disabled={isPending}
                type="submit"
              >
                {isPending ? "Loading" : "Submit"}
              </Button>
            </form>
          </Form>
        </div>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BuySharesModal;
