
const steps = [
  { id: 1, img: "/images/order-received.webp", label: "Order received" },
  { id: 2, img: "/images/inspection.jpg", label: "Inspection" },
  { id: 3, img: "/images/treatment.webp", label: "Implementation" },
  { id: 4, img: "/images/wearing.webp", label: "Monitoring" },
];

function HowItWorks() {
  return (
    <section className="py-12">
      <div className="text-center">
        <p className="mx-auto w-fit px-4 py-1 mb-3 outline outline-primary text-light rounded-4xl bg-primary-light/30">
          Our Process
        </p>
        <h3 className="text-4xl font-semibold text-light mb-10">
          How It Works!
        </h3>
      </div>

      <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8 px-6 md:px-10 justify-items-center">
        {steps.map((step) => (
          <figure
            key={step.id}
            className="text-light text-center flex flex-col items-center max-w-60"
          >
            <div className="relative">
              <img
                src={`${step.img}`}
                alt={step.label}
                loading="lazy"
                className="w-48 h-48 aspect-square border-8 border-primary-light object-cover rounded-full shadow-md"
              />
              <span className="absolute top-2 right-2 inline-flex items-center justify-center min-w-8 h-8 px-2 bg-logo rounded-full text-dark font-bold shadow-sm">
                {step.id}
              </span>
            </div>
            <figcaption className="mt-5 text-xl font-medium tracking-wide">
              {step.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
