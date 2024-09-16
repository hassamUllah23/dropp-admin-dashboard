function Heading({ text, level }) {
  return (
    <p className="flex flex-row justify-start items-center h-full text-[20px] text-nowrap font-[700] leading-[23.48px]">
      {text}
    </p>
  );
}

export { Heading };
