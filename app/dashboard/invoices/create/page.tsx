import { fetchCustomers } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/invoices/create-form';
import { Suspense } from 'react';

export default async function Page() {


    return (
        <main>
            <Suspense fallback={<div>Loading...</div>}>
                <Breadcrumbs
                    breadcrumbs={[
                        { label: 'Invoices', href: '/dashboard/invoices' },
                        {
                            label: 'Create Invoice',
                            href: '/dashboard/invoices/create',
                            active: true,
                        },
                    ]}
                />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
                <CreateFormWrapper />
            </Suspense>
        </main>
    );
}

async function CreateFormWrapper() {
    const customers = await fetchCustomers();
    return <Form customers={customers} />
}
