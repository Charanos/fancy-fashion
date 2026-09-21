const services = [
  { name: "Products", url: "http://localhost:4000/health" },
  { name: "Orders", url: "http://localhost:4001/health" },
  { name: "Payments", url: "http://localhost:4002/health" },
];

export default function Home() {
  return (
    <main className="shell">
      <section className="panel">
        <p className="eyebrow">Monorepo commerce tutorial</p>
        <h1>Lama Commerce Admin</h1>
        <p className="lede">
          A clean starting point for the Turborepo microservices build. The API
          services are stubbed and ready for Prisma, Clerk, Stripe, Kafka, and
          form validation as the tutorial reaches each section.
        </p>
      </section>

      <section className="serviceGrid" aria-label="Service health endpoints">
        {services.map((service) => (
          <a className="service" href={service.url} key={service.name}>
            <span>{service.name}</span>
            <code>{service.url}</code>
          </a>
        ))}
      </section>
    </main>
  );
}
