import { Affix, Button, Modal } from "antd";
import ChangelogCard from "./ChangelogCard";
import { useCallback, useEffect, useRef, useState } from "react";
import ChangelogForm from "./ChangelogForm";
import { Link } from "react-router-dom";
import Spin from "@/components/ui/Spin";
import { Options, query } from "@/hooks/useFetch";
import { GameChangelogI } from "@/ts";
import Masonry from "react-masonry-css";
import { InView } from "react-intersection-observer";
import SkeletonGameChangelog from "@/components/skeletons/SkeletonGameChangelog";
import useGameFilters from "@/hooks/useGameFilters";
import { Filters } from "../GameList/Filters";

const breakpointColumnsObj = {
  default: 3,
  1500: 2,
  1000: 1,
};

const Changelogs = () => {
  const { queryParams } = useGameFilters();
  const page = useRef(1);
  const [addition, setAddition] = useState(false);
  const [data, setData] = useState<GameChangelogI[]>([]);
  const [isMore, setIsMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (reset?: boolean) => {
    page.current = reset ? 1 : page.current + 1;
    setLoading(true);
    const newData = await query<GameChangelogI[]>("gameChangelogs", Options.GET, {
      page: page.current,
      pageSize: 24,
      ...Object.fromEntries(
        Object.entries(queryParams).filter(([, v]) => v != null && v !== "")
      ),
    });
    setIsMore(newData.length === 24);
    if (reset) {
      setData(newData);
    } else {
      setData((prev) => [...prev, ...newData]);
    }
    setLoading(false);
  }, [queryParams]);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  console.log(data);

  const addChangelog = async (values: any) => {
    setLoading(true);
    await query("changelogs", Options.POST, undefined, values);
    setLoading(false);
  };

  const editChangelog = async (values: any, id?: string) => {
    setLoading(true);
    await query("changelogs", Options.PUT, undefined, { ...values, id: id });
    setLoading(false);
  };

  const deleteChangelog = async (id: string) => {
    setLoading(true);
    await query("changelogs", Options.DELETE, { id });
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-16">
      <div className="flex justify-between items-center">
        <Button>
          <Link to="/">Go Back</Link>
        </Button>
        <h1>Changelogs</h1>
        <Button onClick={() => setAddition(true)} type="primary">
          Add changelog
        </Button>
      </div>
      <Modal
        title="Add changelog"
        open={addition}
        onCancel={() => setAddition(false)}
        footer={null}
      >
        <ChangelogForm changelogId="" onFinish={addChangelog} />
      </Modal>
      <Filters />
      <Spin size="large" spinning={loading}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {data?.map((changelog) => (
            <ChangelogCard
              key={changelog.id}
              gameChangelog={changelog}
              onFinish={editChangelog}
              onDelete={deleteChangelog}
            />
          ))}
          {data?.length && isMore ? (
            <>
              <InView as="div" onChange={(inView) => inView && fetchData()}>
                <SkeletonGameChangelog />
              </InView>
              <SkeletonGameChangelog cant={3} />
              <SkeletonGameChangelog cant={4} />
              <SkeletonGameChangelog cant={6} />
            </>
          ) : undefined}
        </Masonry>
      </Spin>
      <Affix offsetBottom={16}>
        <div className="flex justify-end">
          <Button
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            scroll to top
          </Button>
        </div>
      </Affix>
    </div>
  );
};

export default Changelogs;
