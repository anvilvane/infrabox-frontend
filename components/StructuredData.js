import {
  JsonLd,
  organizationSchema,
  websiteSchema,
  softwareApplicationSchema,
  serviceSchema,
} from '@/components/seo/json-ld';

export default function StructuredData() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={softwareApplicationSchema} />
      <JsonLd data={serviceSchema} />
    </>
  );
}
