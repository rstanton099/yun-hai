import PageBanner from '../components/PageBanner';
import OrderForm from '../components/OrderForm';

function Takeaway() {
  return (
    <>
      <PageBanner
        title="Takeaway"
        chinese="外卖"
        subtitle="Order online for collection. Ready in 20–30 minutes."
      />
      <section className="py-12 md:py-16 bg-yun-cream">
        <div className="page-container">
          <OrderForm type="takeaway" />
        </div>
      </section>
    </>
  );
}

export default Takeaway;
