"use client";
import * as React from "react";

import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { format, addDays } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";

import { DeleteIcon, SendIcon } from "lucide-react";
import {
  CalendarIcon,
  CaretSortIcon,
  CheckIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

import { createInvoice } from "@/app/_actions/invoice";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "../ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Product } from "@/db/schema";

const invoiceSchema = z.object({
  customer: z.number().min(1, "Please select a customer"),
  address: z.number(),
  number: z.string(),
  term: z.string(),
  note: z.string().optional(),
  refNumber: z.string().optional(),
  date: z.date(),
  dueDate: z.date(),
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number(),
      price: z.number(),
      tax: z.string().optional(),
    })
  ),
});

interface InvoiceFormProps {
  customers: { name: string; id: number }[];
  terms: { name: string; value: string; day: number }[];
  products: Product[];
}

export default function InvoiceForm({
  customers,
  terms,
  products,
}: InvoiceFormProps) {
  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema, undefined, {
      raw: true,
    }),
    defaultValues: {
      customer: 0,
      address: 0,
      number: "",
      note: "",
      refNumber: "",
      term: "cbd",
      date: new Date(),
      dueDate: new Date(),
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchItemsArray = form.watch("items");
  const controlledItemsArray = fields.map((field, index) => ({
    ...field,
    ...watchItemsArray[index],
  }));

  function onSubmit(values: z.infer<typeof invoiceSchema>) {
    console.log("submit clicked");

    createInvoice(values);
  }

  //   Products Combobox
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<Product | null>(null);

  return (
    <Form {...form}>
      {/* <p>{JSON.stringify(customers)}</p> */}
      {/* <p>{JSON.stringify(products)}</p> */}
      <form
        //   @ts-ignore
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 md:space-y-6 "
      >
        <div className="flex flex-row space-x-4 justify-end">
          <Button className="" variant={"outline"} disabled>
            Save as Draft
          </Button>
          <Button className="" type="submit">
            <SendIcon className="mr-2 h-4 w-4" />
            Save and Continue
          </Button>
        </div>
        <div className="flex flex-col-reverse lg:flex-row gap-4 w-full">
          {/* MAIN INVOICE CARD */}
          <Card className="w-full lg:w-8/12 h-fit">
            <CardHeader className="font-semibold text-xl">Invoice</CardHeader>
            <CardContent className="space-y-4">
              {/* Invoice Number and Ref Number */}
              <div className="flex flex-col lg:flex-row gap-4 justify-between">
                <FormField
                  control={form.control}
                  name={"number"}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Invoice Number</FormLabel>
                      <Input {...field} />
                      <FormDescription>Invoice Number</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={"refNumber"}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Reference Number</FormLabel>
                      <Input {...field} />
                      <FormDescription>
                        P.O / S.O Number. Optional
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator />
              {/*  ITEMS SEARCH COMBOBOX AND BUTTON */}
              <div className="flex flex-row space-x-4">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-3/4 justify-between"
                    >
                      {value?.name || "Select product"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-full p-0"
                    align="start"
                    side="bottom"
                  >
                    <Command>
                      <CommandInput
                        inputMode="search"
                        placeholder="Search product..."
                        className="h-9"
                      />
                      <CommandEmpty>No Product Found</CommandEmpty>
                      <CommandGroup>
                        {products.map((product) => (
                          <CommandItem
                            value={`${product.name} ${product.sku}`}
                            key={product.id}
                            onSelect={() => {
                              setValue(product);
                              setOpen(false);
                            }}
                          >
                            <p>
                              <span className="text-xs text-muted-foreground">
                                {product.sku}
                              </span>{" "}
                              {product.name}
                            </p>
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                product.id === value?.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button
                  className="w-1/4"
                  type="button"
                  onClick={() =>
                    append({
                      productId: value!.id,
                      quantity: 1,
                      price: 0,
                      //   tax: 0,
                    })
                  }
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {controlledItemsArray.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell className="w-[240px]">
                        {
                          products.find(
                            (product) => product.id === field.productId
                          )?.name
                        }
                      </TableCell>
                      <TableCell className="w-[140px]">
                        <Input
                          {...form.register(`items.${index}.quantity` as const)}
                        />
                      </TableCell>
                      <TableCell className="w-[140px]">
                        <Input
                          {...form.register(`items.${index}.price`)}
                          type="number"
                          onChange={(e) =>
                            form.setValue(
                              `items.${index}.price`,
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="w-[140px]">
                        <Input {...form.register(`items.${index}.tax`)} />
                      </TableCell>

                      <TableCell>
                        <Button
                          type="button"
                          className="aspect-square p-0"
                          variant={"destructive"}
                          onClick={() => remove(index)}
                        >
                          <DeleteIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator />
            </CardContent>
            <CardFooter className="w-full flex flex-col">
              <FormField
                name={"note"}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Note</FormLabel>
                    <Textarea {...field} />
                    <FormDescription>Additional information</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardFooter>
          </Card>
          {/* INVOICE INFORMATION & PAYMENT */}
          <Card className="w-full lg:w-4/12 h-fit overflow-clip">
            <CardHeader className="font-semibold text-xl">
              Invoice Information
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name={"customer"}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Send To</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? customers.find(
                                  (customer) => customer.id === field.value
                                )?.name
                              : "Select customer"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search Customer..."
                            className="h-9"
                          />
                          <CommandEmpty>No Customer found.</CommandEmpty>
                          <CommandGroup>
                            {customers.map((customer) => (
                              <CommandItem
                                value={customer.name}
                                key={customer.id}
                                onSelect={() => {
                                  form.setValue("customer", customer.id);
                                }}
                              >
                                {customer.name}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    customer.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>*Select one recipient</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="term"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue(
                          "dueDate",
                          addDays(
                            form.getValues("date"),
                            terms.find((term) => term.value === value)?.day || 0
                          )
                        );
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {terms.map((term) => (
                          <SelectItem value={term.value} key={term.value}>
                            {term.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select payment term</FormDescription>
                  </FormItem>
                )}
              />
              <div className="flex flex-row lg:flex-col gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Invoice Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Date when the invoice is issued
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Invoice Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Due date of the invoice</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <div className=" flex flex-row w-full justify-between">
                  <p>Subtotal</p>
                  <p>
                    IDR <span className="font-semibold">1.234.567</span>
                  </p>
                </div>
                <div className=" flex flex-row w-full justify-between">
                  <p>Tax (0%)</p>
                  <p>
                    IDR <span className="font-semibold">0</span>
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-foreground/5 py-4">
              <div className="flex flex-row justify-between w-full text-lg">
                <p>Total</p>
                <p>
                  IDR <span className="font-semibold">1.234.567</span>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </form>
      {form.formState.errors && <p>{JSON.stringify(form.formState.errors)}</p>}
    </Form>
  );
}
