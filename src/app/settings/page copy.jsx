"use client";
import { useState, useEffect } from "react";
import useApiHook from "@/hooks/useApiHook";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";

const page = () => {
  const { handleApiCall, isApiLoading } = useApiHook();
  const [searchValue, setSearchValue] = useState("");
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize] = useState(10);
  const [rewards, setRewards] = useState(
    filteredRewards.map((reward) => ({ ...reward, isEditing: false }))
  );

  let url = `/settings/all`;

  // // Function to handle input change
  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const updatedRewards = [...rewards];
    updatedRewards[index].rewardPoints = parseInt(value);
    setRewards(updatedRewards);
  };

  // Function to toggle editing mode
  const toggleEditing = (index) => {
    const updatedRewards = [...rewards];
    updatedRewards[index].isEditing = !updatedRewards[index].isEditing;
    setRewards(updatedRewards);
  };

  const getAllRewards = async () => {
    const result = await handleApiCall({
      method: "GET",
      url: url,
    });

    console.log('********', result?.data)
    
    const rewardsArray = [
      { rewardPoints: result?.data?.initialAirDropPoints, rewardType: 'INTIAL AIR DROP', rewardKey: 'initialAirDropPoints'},
      { rewardPoints: result?.data?.wardrobeWizardPoints, rewardType: 'WARDROBE WIZARD', rewardKey: 'wardrobeWizardPoints'},
      { rewardPoints: result?.data?.image360Points, rewardType: 'AI 360 IMAGE', rewardKey: 'image360Points'},
      { rewardPoints: result?.data?.shareDiscordPoints, rewardType: 'SHARE', rewardKey: 'shareDiscordPoints'},
      { rewardPoints: result?.data?.shareTwitterPoints, rewardType: 'SHARE', rewardKey: 'shareTwitterPoints'},
    ]

    setRewards(rewardsArray);
    await calculatePageCount(result);
  };

  const filterRewards = (searchValue) => {
    if (searchValue.trim() === "") {
      setFilteredRewards(rewards);
    } else {
      const filteredData = rewards.filter((reward) => {
        const lowerCaseSearchValue = searchValue.toLowerCase();
        const fullName =
          `${reward?.rewardType}`.toLowerCase();
        return fullName.includes(lowerCaseSearchValue);
      });
      setFilteredRewards(filteredData);
    }
  };

  const handleSearchInputChange = (e) => {
    const newSearchValue = e.target.value;
    setSearchValue(newSearchValue);
    filterRewards(newSearchValue);
  };

  const calculatePageCount = async (count) => {
    setCount(count);
    setPageCount(Math.ceil(count / pageSize));
  };

  const handleBalanceSave = async (item, index) => {

    const rewardKey = rewards[index].rewardKey;
    const rewardPoints = rewards[index].rewardPoints;

    const update = {};
     update[`${rewardKey}`] = rewardPoints;
    // console.log('*******', item?_id)

    const result = await handleApiCall({
      method: "PUT",
      url: `/settings/change`,
      data: {
        rewardId: item._id,
        update,
      },
    });

    if (result.status === 200) {
      item.isEditing = false;
      getAllRewards();
      toast.success(result.data.message);
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleCancle = async (index) => {
    getAllRewards();
    toggleEditing(index);
  };
  
  useEffect(() => {
    setFilteredRewards(rewards);
  }, [rewards]);

  useEffect(() => {
    getAllRewards();
  }, [page, pageSize]);

  return (
    <div className="px-3 md:px-14 py-6 w-full m-auto flex flex-col text-white">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between my-4">
        <h1 className="flex items-center text-[20px] font-[700] leading-[23.48px]">
          Rewards
        </h1>

        <div className="max-w-[334px] w-full flex items-center border border-white rounded-lg p-2">
          <input
            type="text"
            id="search"
            className="w-full bg-transparent"
            placeholder="Search"
            value={searchValue}
            onChange={handleSearchInputChange}
          />
          <label htmlFor="search" className="cursor-pointer">
            <img
              src="/search-normal.svg"
              alt="search icon"
              width={24}
              height={24}
            />
          </label>
        </div>
      </div>

      <div className="overflow-x-auto ">
        <table className="table-auto overflow-scroll text-white w-[1024px] lg:w-full border border-transparent mb-6">
          <thead className="bg-[#262626] text-white rounded-[4px]">
            <tr className="">
              <th className="py-4 px-2 text-sm text-[#FFFFFF] leading-[21.74px] text-left rounded-l-[4px] w-1/2">
                Reward
              </th>
              <th className="py-4 px-2 text-sm text-[#FFFFFF] text-left leading-[21.74px] w-1/2">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRewards.length > 0 ? (
              filteredRewards.map((item, index) => {
                return (
                  <tr key={index} className="my-3 row w-full darkGrayBg">
                    <td className="py-4 px-2 text-sm text-[#FFFFFF] leading-[21.74px] rounded-l-[4px] border-b-8  border-t-8 border-black">
                      {`${item.rewardType}`}
                    </td>
                    <td className="coinsUpdate w-[300px] py-4 px-2 text-sm text-[#808080] leading-[21.74px] border-b-8  border-t-8 border-black">
                      <div className="relative group cursor-pointer">
                        <div className="flex gap-2 items-center">
                          {item.isEditing ? (
                            <input
                              type="number"
                              value={rewards[index].rewardPoints}
                              onChange={(e) => handleInputChange(e, index)}
                              autoFocus
                              className="bg-[#0C0C0C] rounded-[4px] p-3"
                            />
                          ) : (
                            <div className="flex gap-[5px] items-center">
                              {/* <img
                                src="/assets/images/sidebar/dropcoin.png"
                                alt="dropcoin"
                                width={21.93}
                                height={26.01}
                              /> */}
                              <span className="text-[14px] leading-[16.1px]">
                                {item?.rewardPoints}
                              </span>
                            </div>
                          )}
                          {item.isEditing ? (
                            <div className="flex gap-2">
                              <button onClick={() => handleCancle(index)}>
                                <img
                                  src="/close-square.svg"
                                  alt="close-button"
                                  width={32}
                                  height={32}
                                />
                              </button>
                              {isApiLoading ? (
                                <div className="flex justify-center items-center">
                                  <RotatingLines
                                    height="20"
                                    width="20"
                                    color="gray"
                                    strokeColor="white"
                                    strokeWidth="5"
                                    animationDuration="0.75"
                                    ariaLabel="rotating-lines-loading"
                                  />
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleBalanceSave(item, index)}
                                >
                                  <img
                                    src="/tick-square.svg"
                                    alt="close-button"
                                    width={32}
                                    height={32}
                                  />
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center">
                              <button
                                onClick={() => toggleEditing(index)}
                                className=" w-[21.33px] h-[21.33px]"
                              >
                                <img
                                  src="/edit-2.svg"
                                  alt="arrow"
                                  width={21.33}
                                  height={21.33}
                                />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="pl-1 pt-4">
                  No rewards found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && (
        <div className="flex gap-[10px] items-center justify-center mb-3">
          {page > 1 && (
            <button
              className="w-9 h-9 flex items-center justify-center  bg-[#1B1B1B] rounded-[6px] cursor-pointer hover:bg-[#262626]"
              onClick={() => setPage(page - 1)}
            >
              <img
                src="/arrow-left.svg"
                alt="arrow-left"
                width={20}
                height={20}
              />
            </button>
          )}
          <div className="flex gap-[10px]">
            {Array.from({ length: pageCount }, (_, i) => (
              <div
                key={i}
                className={`bg-[#1B1B1B] py-2 px-[14px] rounded-[6px] cursor-pointer ${
                  i + 1 == page && "!bg-[#262626]"
                }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </div>
            ))}
          </div>
          {page < pageCount && (
            <button
              className="w-9 h-9 flex items-center justify-center bg-[#1B1B1B] rounded-[6px] cursor-pointer hover:bg-[#262626]"
              onClick={() => setPage(page + 1)}
            >
              <img
                src="/arrow-down.svg"
                alt="arrow-right"
                width={20}
                height={20}
              />
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default page;
