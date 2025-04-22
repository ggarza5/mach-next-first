'use client';

import { MachProvider } from '@/components/MachProvider';
import { Swap } from '@/components/Swap';
import { Layout } from '@/components/Layout';

export default function Home() {
  return (
    <MachProvider>
      <Layout>
        <Swap />
      </Layout>
    </MachProvider>
  );
}
