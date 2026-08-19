import VsInfraboxPage, { buildVsMetadata } from "../_vs/VsInfraboxPage";
import { getVsEntry } from "../_vs/vs-data";

const data = getVsEntry("primeforge-vs-infrabox");

export const metadata = buildVsMetadata(data);

export default function Page() {
  return <VsInfraboxPage data={data} />;
}
