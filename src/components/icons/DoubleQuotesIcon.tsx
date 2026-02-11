type Props = {};

export default function DoubleQuotesIcon({}: Props) {
  return (
    <div className="flex items-end w-[88px] h-16 rounded-sm bg-gradient-to-r from-primary-main-dark to-secondary">
      <div className="triangle" />
      <div className="bg-white rounded rounded-r-none rounded-bl-none size-5" />

      <div className="w-2 h-16 bg-white " />

      <div className="triangle" />
      <div className="bg-white rounded rounded-r-none rounded-bl-none size-5" />
    </div>
  );
}
