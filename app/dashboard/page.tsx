import Link from "next/link";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-3 flex flex-col gap-6">
        <div>Accounts Card - Left Col</div>
      </section>
      <section className="col-span-3 flex flex-col gap-6">
        <div>
          <div>Spending Col</div>
          <div>Bills Col</div>
        </div>
        <div>
          <Link href="/dashboard/departments">Departments Page</Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
