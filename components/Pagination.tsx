import { useState } from "react";

const PAGE_WINDOW = 10;

const Pagination = ({
  currPage,
  setCurrPage,
  totalPages,
}: {
  currPage: number;
  setCurrPage: (curr: number) => void;
  totalPages: number;
}) => {
  const [startPage, setStartPage] = useState<number>(
    Math.floor((currPage - 1) / PAGE_WINDOW) * PAGE_WINDOW + 1,
  );
  const endPage = Math.min(startPage + PAGE_WINDOW - 1, totalPages);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      setStartPage(1);
      return;
    }
    setStartPage(page);
  };

  const goPrevWindow = () => {
    goToPage(startPage - PAGE_WINDOW);
  };

  const goNextWindow = () => {
    goToPage(startPage + PAGE_WINDOW);
  };

  console.log(startPage);

  return (
    <div className="flex flex-wrap gap-2 m-auto pb-8 justify-center items-center">
      {/* Prev window */}
      <button
        onClick={goPrevWindow}
        disabled={startPage === 1}
        className={`px-3 py-2 rounded-md cursor-pointer border transition-all
          ${
            startPage === 1
              ? "cursor-not-allowed opacity-40"
              : "hover:bg-primary hover:text-background"
          }`}
      >
        Prev
      </button>

      {/* Page numbers */}
      {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
        const page = startPage + i;
        const isActive = currPage === page;

        return (
          <button
            key={page}
            onClick={() => {
              setCurrPage(page);
            }}
            aria-current={isActive ? "page" : undefined}
            className={`min-w-10 px-3 py-2 cursor-pointer rounded-md border transition-all
              ${
                isActive
                  ? "bg-primary text-background"
                  : "bg-background text-primary hover:bg-primary hover:text-background"
              }`}
          >
            {page}
          </button>
        );
      })}

      {/* Ellipsis + last page */}
      {endPage < totalPages && (
        <>
          <span className="px-2 text-muted-foreground select-none">…</span>
          <button
            onClick={() => goToPage(totalPages)}
            className={`min-w-10 px-3 py-2 rounded-md border transition-all
              ${
                currPage === totalPages
                  ? "bg-primary text-background"
                  : "bg-background text-primary hover:bg-primary hover:text-background"
              }`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next window */}
      <button
        onClick={goNextWindow}
        disabled={endPage === totalPages}
        className={`px-3 py-2 rounded-md cursor-pointer border transition-all
          ${
            endPage === totalPages
              ? "cursor-not-allowed opacity-40"
              : "hover:bg-primary hover:text-background"
          }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
