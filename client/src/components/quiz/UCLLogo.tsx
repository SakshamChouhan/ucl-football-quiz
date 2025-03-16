import { Trophy } from "lucide-react";

export const UCLLogo = () => {
  return (
    <div className="flex justify-center mb-6">
      <div className="relative w-48 h-48 md:w-64 md:h-64">
        {/* UEFA Champions League Logo */}
        <div className="absolute inset-0 rounded-full bg-[#0e1e5b] border-4 border-[#b3b3b3] flex items-center justify-center">
          <div className="text-[#b3b3b3] text-center">
            <Trophy className="w-16 h-16 mx-auto mb-2 text-[#cfa00d]" />
            <div className="font-montserrat font-bold text-xl">UEFA CHAMPIONS LEAGUE</div>
            <div className="font-montserrat text-sm">QUIZ</div>
          </div>
        </div>
        {/* Stars circle decoration */}
        <div className="absolute inset-0 rounded-full border-2 border-[#b3b3b3] animate-pulse opacity-50" style={{ transform: 'scale(1.1)' }}></div>
      </div>
    </div>
  );
};

export default UCLLogo;
