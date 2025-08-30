import { Button } from "../ui/button";

const OrphanageBanner = () => {
  return (
    <div className={"rounded-lg bg-main-blue p-8 text-center my-12"}>
      <div className="flex flex-col items-center justify-center space-y-5">
        <h2
          className={"text-2xl lg:text-4xl 2xl:text-5xl font-bold text-white"}
        >
          Join Our Support Network
        </h2>
        <p className={"text-white w-[60%]"}>
          Are you an orphanage seeking assistance or resources? Register today
          and become part of our growing community of care.
        </p>
        <Button size={"lg"} className={"bg-main-red/70 hover:bg-main-red/50"}>
          Register Now
        </Button>
      </div>
    </div>
  );
};

export default OrphanageBanner;
