import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/invoices/edit-form';
import { InvoiceSkeleton } from '@/app/ui/skeletons';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export default function Page(props: { params: Promise<{ id: string }> }) {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <BreadcrumbsWrapper params={props.params} />
      </Suspense>
      <Suspense fallback={<InvoiceSkeleton />}>
        <FormWrapper params={props.params} />
      </Suspense>
    </main>
  );
}

async function BreadcrumbsWrapper(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  return <Breadcrumbs breadcrumbs={[
    { label: 'Invoices', href: '/dashboard/invoices' },
    {
      label: 'Edit Invoice',
      href: `/dashboard/invoices/${id}/edit`,
      active: true,
    },
  ]} />
}

async function FormWrapper(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);
  if (!invoice) {
    notFound();
  }

  return <Form invoice={invoice} customers={customers} />
}