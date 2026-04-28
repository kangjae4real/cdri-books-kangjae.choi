import Image from "next/image";
import { Text } from "@/components/typography";

type ListEmptyProps = {
  message: string;
};

export default function ListEmpty({ message }: ListEmptyProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <Image src="/assets/icons/icon-book.png" alt="" width={80} height={80} />
      <Text type="paragraph" className="text-muted-foreground">
        {message}
      </Text>
    </div>
  );
}
