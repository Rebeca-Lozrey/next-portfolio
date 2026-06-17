import { Select } from "@radix-ui/themes";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
};

export default function UrlFilter({ value, onValueChange }: Props) {
  return (
    <div>
      <Select.Root value={value} onValueChange={onValueChange} size="3">
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="select-all">All Pages</Select.Item>
          <Select.Item value="/">Home</Select.Item>
          <Select.Item value="/my-articles">My Articles</Select.Item>
          <Select.Item value="/web-vitals">Web Vitals</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
