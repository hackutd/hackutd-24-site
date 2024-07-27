export default function HomeChallengesCard(props: { challenge: Challenge; blockType: number }) {
  return (
    <div className="h-full w-full mx-auto bg-white rounded-lg mb-8 mt-8 z-[9999] relative">
      <div className="w-4/5 md:w-full mx-auto">
        <div className="w-5/6 mx-auto">
          {/* Challenge Name */}
          <div className="flex justify-center">
            <h1 className="font-nunito text-2xl font-bold mt-4 text-center border-b-2 border-[rgb(0,0,0,0.4)] w-fit">
              <span className="uppercase">presented by {props.challenge.organization}</span>
            </h1>
          </div>
          {/* Company Name */}
          <h1 className="font-nunito text-xl text-[#05149C] font-bold my-4">
            {props.challenge.title}
          </h1>
          {/* Description */}
          <div className="mb-8 max-w-fit">
            <p className="text-md line-clamp-5 text-balance">{props.challenge.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
