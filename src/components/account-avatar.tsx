export function AccountAvatar({
  account,
  className = '',
}: {
  account: string;
  className?: string;
}) {
  const from = account.substr(2, 6);
  const to = account.substr(account.length - 6);

  return (
    <div
      className={`rounded-full ${className}`.trim()}
      style={{
        backgroundImage: `linear-gradient(to bottom, #${from}, #${to})`,
      }}
    />
  );
}
