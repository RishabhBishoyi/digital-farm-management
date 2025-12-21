const StatusBadge = ({ status, daysRemaining, remainingUnit = 'days' }) => {
  const isSafe = status === "SAFE";
  return (
    <div className="flex flex-col items-start gap-1">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          isSafe
            ? "bg-green-900/30 text-green-400 border-green-800"
            : "bg-red-900/30 text-red-400 border-red-800"
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isSafe ? 'bg-green-500' : 'bg-red-500'}`}></span>
        {status}
      </span>
      {!isSafe && daysRemaining > 0 && (
        <span className="text-xs text-red-400 font-medium ml-1">
          {daysRemaining} {remainingUnit === 'minutes' ? 'mins' : 'days'} left
        </span>
      )}
    </div>
  );
};

export default StatusBadge;
