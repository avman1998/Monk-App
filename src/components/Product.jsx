export default function Product({ data, setFilteredProducts }) {
  function handleParentCheck(id) {
    setFilteredProducts((prev) => {
      return [...prev].map((item) => {
        if (item.id == id) {
          return {
            ...item,
            selected: !item.selected,
            variants: item?.variants.map((v) => {
              return {
                ...v,
                selected: !item.selected,
              };
            }),
          };
        } else return item;
      });
    });
  }

  function handleChildCheck(e, parent_id, child_id) {
    setFilteredProducts((prev) => {
      return [...prev].map((item) => {
        if (item.id == parent_id) {
          return {
            ...item,
            selected:
              item.selected === true && e.target.checked === true
                ? true
                : item?.variants
                    ?.filter((i) => i.id !== child_id)
                    .some((j) => j.selected === true)
                ? true
                : !item.selected,
            variants: item?.variants.map((v) => {
              if (v.id === child_id)
                return {
                  ...v,
                  selected: !v.selected,
                };
              else return v;
            }),
          };
        } else return item;
      });
    });
  }
  return (
    <div className="flex flex-col text-base">
      <div
        className="flex gap-3 p-3 items-center cursor-pointer"
        onClick={() => handleParentCheck(data.id)}
      >
        <input
          type="checkbox"
          checked={data.selected}
          onChange={() => handleParentCheck(data.id)}
        />
        {data?.image?.src ? (
          <img
            src={data?.image?.src}
            alt={data.title}
            width="36px"
            height="36px"
            className="rounded"
          />
        ) : (
          <img
            src={
              "https://www.freeiconspng.com/thumbs/cart-icon/basket-cart-icon-27.png"
            }
            alt={data.title}
            width="36px"
            height="36px"
            className="rounded"
          />
        )}
        <p>{data.title}</p>
      </div>
      <hr />
      <ul className="flex-col">
        {data.variants.map((item) => {
          return (
            <div
              className="cursor-pointer"
              key={item.id}
              onClick={(e) => handleChildCheck(e, data.id, item.id)}
            >
              <div className="flex pl-6 gap-3 p-3">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={(e) => handleChildCheck(e, data.id, item.id)}
                />
                <p className="">{item.title}</p>
              </div>
              <hr />
            </div>
          );
        })}
      </ul>
    </div>
  );
}
