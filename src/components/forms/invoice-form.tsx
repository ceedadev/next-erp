"use client";
import * as React from "react";

import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { format, addDays, set } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";

import { invoiceSchema } from "@/lib/validations/invoice";

import { DeleteIcon, SendIcon } from "lucide-react";
import {
  CalendarIcon,
  CaretSortIcon,
  CheckIcon,
  PlusIcon,
  Cross2Icon,
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
import { Tax } from "@/app/_actions/tax";

interface InvoiceFormProps {
  customers: { name: string; id: number }[];
  terms: { name: string; value: string; day: number }[];
  products: Product[];
  tax: Tax[];
  number: string;
}

export default function InvoiceForm({
  customers,
  terms,
  products,
  tax,
  number,
}: InvoiceFormProps) {
  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema, undefined, {
      raw: true,
    }),
    defaultValues: {
      customer: 0,
      address: 0,
      number: number,
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
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );

  // Invoice Summary
  const subTotalInvoice = () => {
    let total = 0;
    controlledItemsArray.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };
  const totalTaxInvoice = () => {
    let total = 0;
    controlledItemsArray.forEach((item) => {
      total += (item.price * item.quantity * item.taxRate) / 100;
    });
    return total;
  };
  const totalInvoice = () => {
    let total = 0;
    controlledItemsArray.forEach((item) => {
      total +=
        item.price * item.quantity +
        (item.price * item.quantity * item.taxRate) / 100;
    });
    return total;
  };

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
                      <Input {...field} disabled />
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
                      {selectedProduct?.name || "Select product"}
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
                              setSelectedProduct(product);
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
                                product.id === selectedProduct?.id
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
                  disabled={!selectedProduct}
                  className="aspect-square p-0 "
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    setSelectedProduct(null);
                    setOpen(false);
                    form.clearErrors("items");
                  }}
                >
                  <Cross2Icon className="h-4 w-4" />
                </Button>
                <Button
                  disabled={!selectedProduct}
                  className="w-1/4"
                  type="button"
                  onClick={() => {
                    // check if product quantity is 0, if so, don't add
                    if (
                      selectedProduct &&
                      selectedProduct.quantity === 0 &&
                      selectedProduct.quantity < 1
                    ) {
                      // throw form error
                      return form.setError(
                        "items",
                        {
                          type: "manual",
                          message: `Product ${selectedProduct.name} is out of stock`,
                        },
                        {
                          shouldFocus: true,
                        }
                      );
                    } else {
                      append({
                        productId: selectedProduct!.id,
                        quantity: 1,
                        price: Number(selectedProduct!.price),
                        taxRate: 0,
                      });
                      setSelectedProduct(null);
                      setOpen(false);
                      form.clearErrors("items");
                    }
                  }}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
              {
                // error message
                form.formState.errors.items && (
                  <p className="text-destructive">
                    {form.formState.errors.items.message}
                  </p>
                )
              }
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-center">Price</TableHead>
                    <TableHead className="text-center">Tax</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    // empty state
                    controlledItemsArray.length === 0 && (
                      <TableRow>
                        <TableCell className="text-center" colSpan={6}>
                          <p className="text-muted-foreground">
                            No items added
                          </p>
                          {form.formState.errors.items && (
                            <p className="text-destructive">
                              {form.formState.errors.items.message}
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  }
                  {controlledItemsArray.map((field, index) => {
                    const amount = field.quantity * field.price;
                    const amountTax = (amount * field.taxRate) / 100;
                    const total = amount + amountTax;
                    return (
                      <TableRow key={index} className="table-row">
                        <TableCell className="min-w-[120px]">
                          <div className="flex flex-col w-full">
                            <p>
                              {
                                products.find(
                                  (product) => product.id === field.productId
                                )?.name
                              }
                            </p>
                            <p>
                              <span className="text-xs text-muted-foreground">
                                {
                                  products.find(
                                    (product) => product.id === field.productId
                                  )?.sku
                                }
                              </span>
                            </p>
                          </div>
                        </TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={(f) => (
                            <TableCell className="w-[80px]">
                              <Input
                                {...f.field}
                                type={"number"}
                                value={f.field.value}
                                max={
                                  products.find(
                                    (product) => product.id === field.productId
                                  )?.quantity || 0
                                }
                                min={1}
                                onChange={(e) =>
                                  f.field.onChange(Number(e.target.value))
                                }
                              />
                              <FormMessage />
                            </TableCell>
                          )}
                        />
                        <FormField
                          name={`items.${index}.price`}
                          control={form.control}
                          render={({ field }) => (
                            <TableCell className="w-[140px]">
                              <FormItem>
                                <Input
                                  {...field}
                                  value={field.value}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormItem>
                            </TableCell>
                          )}
                        />
                        <FormField
                          name={`items.${index}.taxRate`}
                          control={form.control}
                          render={({ field }) => (
                            <TableCell className="w-[80px]">
                              <FormItem>
                                <Select
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  }
                                  defaultValue={tax
                                    .find((t) => t.rate === field.value)
                                    ?.rate.toString()}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={"Tax"} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {tax.map((t) => (
                                      <SelectItem
                                        value={t.rate.toString()}
                                        key={t.id}
                                      >
                                        {t.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            </TableCell>
                          )}
                        />

                        <TableCell className="w-[120px] text-right">
                          {total.toLocaleString()}
                          {/*TODO: dynamically format number from constant {Number(total).toLocaleString(navigator.language, {
                            style: "currency",
                            currency: "IDR",
                          })} */}
                        </TableCell>
                        <TableCell className="w-[55px]">
                          <Button
                            type="button"
                            className="aspect-square p-0 text-destructive hover:bg-destructive hover:text-white"
                            variant={"outline"}
                            onClick={() => remove(index)}
                          >
                            <DeleteIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
                    IDR{" "}
                    <span className="font-semibold">
                      {subTotalInvoice().toLocaleString()}
                    </span>
                  </p>
                </div>
                <div className=" flex flex-row w-full justify-between">
                  <p>Tax</p>
                  <p>
                    IDR{" "}
                    <span className="font-semibold">
                      {totalTaxInvoice().toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-foreground/5 py-4">
              <div className="flex flex-row justify-between w-full text-lg">
                <p>Total</p>
                <p>
                  IDR{" "}
                  <span className="font-semibold">
                    {totalInvoice().toLocaleString()}
                  </span>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
        {/* //FORM DEBUG
        {form.formState.errors && (
          <p>{JSON.stringify(form.formState.errors)}</p>
        )} */}
      </form>
    </Form>
  );
}
