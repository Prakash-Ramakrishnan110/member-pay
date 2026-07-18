import { PlatformConfigClient } from '@/components/admin/platform-config-client';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function PlatformConfigPage() {
  const supabase = await createClient();
  const { data: config } = await supabase
    .from('platform_settings')
    .select('*')
    .limit(1)
    .single();

  const { data: saasPlans } = await supabase
    .from('saas_plans')
    .select('*')
    .order('price', { ascending: true });

  return <PlatformConfigClient initialConfig={config} saasPlans={saasPlans || []} />;
}
