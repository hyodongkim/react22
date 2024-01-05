import axios from 'axios';
import { useState, useEffect } from 'react';
export default function App() {
  const [numOfRows, setNumOfRows] = useState(10); // 한 페이지에 표시할 항목의 수
  const [searchData, setSearchData] = useState([]);
  const [inputText, setInputText] = useState('');
  const [filteredData, setFilteredData] = useState(null);
  const [pageNo, setPageNo] = useState(1); // 현재 페이지 번호
  const [totalCount, setTotalCount] = useState(0); // 전체 항목의 수
  const [startPage, setStartPage] = useState(1); // 현재 보이는 페이지 버튼의 시작 페이지 번호
  const search_url = `http://openapi.foodsafetykorea.go.kr/api/feee4a19d6674a738515/I1590/json/1/600`;
  const searchFunc = async () => {
    const response = await axios.get(search_url);
    setSearchData(response.data.I1590.row);
    setTotalCount(response.data.I1590.total_count);
  };
  const getValue = (e) => {
    setInputText(e.target.value);
  };
  const handleSearch = () => {
    setFilteredData(
      searchData.filter((item) => item.BSSH_NM.includes(inputText))
    );
  };
  const handlePageChange = (newPageNo) => {
    setPageNo(newPageNo);
  };
  const handleNext = () => {
    setStartPage(startPage + 10);
  };
  useEffect(() => {
    searchFunc();
  }, []);
  const dataToDisplay = (filteredData || searchData).slice(
    (pageNo - 1) * numOfRows,
    pageNo * numOfRows
  );
  return (
    <div className="box">
      <p>
        식품모범음식점 API |{' '}
        <span>{Number(totalCount).toLocaleString()}개 상점</span>
      </p>
      <input type="text" value={inputText} onChange={getValue} />
      <hr />
      <button onClick={handleSearch}>검색</button>
      <div>
        {dataToDisplay.map((item, i) => (
          <div key={i}>
            <p>{item.LCNS_NO}</p>
            <p>{item.BSSH_NM}</p>
          </div>
        ))}
      </div>
      <div>
        {Array(Math.ceil(totalCount / numOfRows))
          .fill()
          .slice(startPage - 1, startPage + 9)
          .map((_, i) => (
            <button key={i} onClick={() => handlePageChange(startPage + i)}>
              {startPage + i}
            </button>
          ))}
        <button onClick={handleNext}>다음</button>
      </div>
    </div>
  );
}