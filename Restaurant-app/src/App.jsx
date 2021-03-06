import "./index.css";
import Restaurant from "./component/Restaurant.jsx";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function getRestaurantData() {
      const response = await fetch(
        `https://restaurants-app-01.herokuapp.com/Restaurant?_page=${page}&_limit=4`
      );
      const Data = await response.json();
      setData(Data);
    }
    getRestaurantData();
  }, [page]);
  const [state, setState] = useState({
    filterRating: 0,
  });
  const [payment, setPayment] = useState({
    paymentMethod: "All",
  });
  const [cost, setCost] = useState({
    sortMethod: null,
  });

  const handleRating = (rating) => {
    setState({ filterRating: rating });
  };
  const handlePayment = (payment) => {
    setPayment({ paymentMethod: payment });
  };

  const handleSort = (order) => {
    setCost({ sortMethod: order });
  };
  const handlePage = (value) => {
    setPage(page + value);
  };

  return (
    <div className="App">
      <h1>RESTAURANTS</h1>
      <div className="bg-gray">
        Ratings:
        {[4, 3, 2, 1, 0].map((rating) => {
          return (
            <button key={rating} onClick={() => handleRating(rating)}>
              {rating === 0 ? "All" : rating}
            </button>
          );
        })}
      </div>
      <div className="bg-gray">
        Payment Methods:
        {["All", "Cash", "Card"].map((method) => {
          return (
            <button key={method} onClick={() => handlePayment(method)}>
              {method}
            </button>
          );
        })}
      </div>
      <div className="bg-gray">
        Cost:
        {["Low To High", "High To Low"].map((order) => {
          return (
            <button key={order} onClick={() => handleSort(order)}>
              {order}
            </button>
          );
        })}
      </div>
      {data
        .filter(({ rating, payment_methods }) => {
          const { cash, card } = payment_methods;
          let paymentCondition = true;
          if (payment.paymentMethod === "Cash") {
            paymentCondition = cash ? true : false;
          } else if (payment.paymentMethod === "Card") {
            paymentCondition = card ? true : false;
          }
          return rating >= state.filterRating && paymentCondition;
        })
        .sort((a, b) => {
          if (cost.sortMethod === "Low To High") {
            return a.costForOne - b.costForOne;
          }
          if (cost.sortMethod === "High To Low") {
            return b.costForOne - a.costForOne;
          }
          return 0;
        })
        .map((item) => {
          console.log(item);
          return <Restaurant {...item} key={item.id} />;
        })}
      <div className="paginate">
        <button onClick={() => handlePage(-1)}>Prev</button>
        <button onClick={() => handlePage(+1)}>Next</button>
      </div>
    </div>
  );
}

export default App;
