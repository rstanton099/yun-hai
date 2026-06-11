import PageBanner from '../components/PageBanner';
import OrderForm from '../components/OrderForm';

function Delivery() {
  return (
    <>
      <PageBanner
        title="Delivery"
        chinese="送餐"
        subtitle="Local delivery within 3 miles. Free on orders over £30."
      />
      <section className="py-12 md:py-16 bg-yun-cream">
        <div className="page-container">
          <OrderForm type="delivery" />
        </div>
      </section>
    </>
  );
}

export default Delivery;
