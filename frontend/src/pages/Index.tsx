import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import DiseaseChart from "../components/DiseaseChart";
import CommentList from "../components/CommentList";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Lab Report Analytics Dashboard
          </h2>
          <p className="text-muted-foreground">
            Monitor patient distribution across different diseases and health
            conditions
          </p>
        </div>
        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DiseaseChart />
          </div>
          <div>
            <CommentList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
