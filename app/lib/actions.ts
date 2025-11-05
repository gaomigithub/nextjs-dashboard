'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { z } from 'zod';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  console.log("=== Server Action: createInvoice started ===");

  // 记录收到的表单数据
  console.log("Received formData:");
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}: ${value}`);
  }

  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {    // 模拟一些处理时间
    await new Promise(resolve => setTimeout(resolve, 1000));

    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

    console.log("=== Server Action: createInvoice completed ===");


  } catch (error) {
    console.error("Error creating invoice:", error);
  } finally {
    revalidatePath('/dashboard/invoices');
  }


  // 重定向回发票列表页面
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;


  } catch (error) {
    console.error("Error updating invoice:", error);
  } finally {
    revalidatePath('/dashboard/invoices');
  }
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  console.log("=== Server Action: deleteInvoice started ===");
  throw new Error('Failed to Delete Invoice');
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;

  } catch (error) {
    console.error("Error deleting invoice:", error);
  } finally {
    revalidatePath('/dashboard/invoices');
  }
}