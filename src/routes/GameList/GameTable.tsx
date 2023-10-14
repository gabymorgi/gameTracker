import { Affix, Button, Col, Form, Popconfirm, Row } from "antd";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { GameI, CreatedGame, EndPoint } from "@/ts/index";
import { TableContainer } from "@/styles/TableStyles";
import { Score, ScoreHeader } from "@/components/ui/Score";
import { Tags } from "@/components/ui/Tags";
import { State } from "@/components/ui/State";
import { Achievements } from "@/components/ui/Achievements";
import { format } from "date-fns";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { AuthContext } from "@/contexts/AuthContext";
import { formatPlayedTime, numberToDate } from "@/utils/format";
import Img from "@/components/ui/Img";
import Modal from "@/components/ui/Modal";
import { InputGame } from "@/components/Form/InputGame";
import { CreateGame } from "./CreateGame";
import { query, Options } from "@/hooks/useFetch";
import useGameFilters from "@/hooks/useGameFilters";
import SkeletonGameList from "@/components/skeletons/SkeletonGameList";
import { InView } from "react-intersection-observer";
import { Link } from "react-router-dom";

const GameTable: React.FC = () => {
  const { queryParams } = useGameFilters();
  const page = useRef(1);
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GameI[]>([]);
  const [isMore, setIsMore] = useState(true);

  const [selectedGame, setSelectedGame] = useState<GameI>();

  const fetchData = useCallback(
    async (reset?: boolean) => {
      page.current = reset ? 1 : page.current + 1;
      if (reset) {
        setData([]);
      }
      setLoading(true);
      const newData = await query<GameI[]>(EndPoint.GAMES, Options.GET, {
        page: page.current,
        pageSize: 24,
        ...Object.fromEntries(
          Object.entries(queryParams).filter(([, v]) => v != null && v !== "")
        ),
      });
      setLoading(false);
      setData((prev) => [...prev, ...newData]);
      setIsMore(newData.length === 24);
    },
    [queryParams]
  );

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  const updateItem = async ({ game }: { game: CreatedGame }) => {
    setLoading(true);
    if (!selectedGame) return;
    await query(
      EndPoint.GAMES,
      Options.PUT,
      {},
      { ...game, id: selectedGame.id }
    );
    const updatedData = data.map((g) => {
      if (g.id === selectedGame.id) {
        return { ...g, ...game };
      }
      return g;
    });
    setData(updatedData);
    setSelectedGame(undefined);
    setLoading(false);
  };

  const delItem = useCallback(async (id: string) => {
    await query(EndPoint.GAMES, Options.DELETE, {}, { id });
  }, []);

  const addItem = useCallback(async (game: CreatedGame) => {
    await query(EndPoint.GAMES, Options.POST, {}, [game]);
  }, []);

  const formId = `form-${selectedGame?.id}`;
  return (
    <div className="flex flex-col gap-16">
      {isAuthenticated ? (
        <div className="flex gap-16">
          <CreateGame handleAddItem={addItem} />
          <Button>
            <Link to="/games/recent">Recently Played</Link>
          </Button>
          <Button>
            <Link to="/games/massive">Massive Update</Link>
          </Button>
        </div>
      ) : undefined}
      <TableContainer>
        <Row gutter={[16, 16]}>
          <Col id="header" span={24}>
            <div className="card">
              <div id="name">Name</div>
              <div id="date">Date</div>
              <div id="state">State</div>
              <div id="hours">Hours</div>
              <div id="achievements">Achievements</div>
              <div id="tags">Tags</div>
              <div id="score">
                <ScoreHeader />
              </div>
              {isAuthenticated ? <div id="actions">Actions</div> : undefined}
            </div>
          </Col>
          {!data?.length && loading ? <SkeletonGameList /> : undefined}
          {data?.map((g) => {
            return (
              <Col xs={24} sm={12} lg={8} xl={6} xxl={24} key={g.id}>
                <div className="card">
                  <div id="name">
                    <a
                      href={`https://steampowered.com/app/${g.appid}`}
                      target="_blank"
                      rel="noreferrer"
                      title={g.name || undefined}
                    >
                      <Img
                        width="200px"
                        height="94px"
                        style={{ objectFit: "cover" }}
                        src={g.imageUrl || ""}
                        alt={`${g.name} header`}
                        $errorComponent={
                          <span className="font-16">{g.name}</span>
                        }
                      />
                    </a>
                  </div>
                  <div id="date">
                    <div>
                      {g.start
                        ? format(numberToDate(g.start), "dd MMM yyyy")
                        : "-"}
                    </div>
                    <div>
                      {g.end ? format(numberToDate(g.end), "dd MMM yyyy") : "-"}
                    </div>
                  </div>
                  <div id="state">
                    <State state={g.stateId || undefined} />
                  </div>
                  <div id="hours">
                    {formatPlayedTime(g.playedTime + (g.extraPlayedTime || 0))}
                  </div>
                  <div id="achievements">
                    {g.totalAchievements ? (
                      <Achievements
                        obtained={g.obtainedAchievements}
                        total={g.totalAchievements}
                      />
                    ) : (
                      "-"
                    )}
                  </div>
                  <div id="tags">
                    <Tags tags={g.gameTags || undefined} />
                  </div>
                  <div id="score">
                    <label>
                      <ScoreHeader />
                    </label>
                    <Score score={g.score} />
                  </div>
                  <div id="actions" className="flex gap-8">
                    {isAuthenticated ? (
                      <>
                        <Button
                          onClick={() => setSelectedGame(g)}
                          icon={<EditFilled />}
                        />
                        <Popconfirm
                          title="Are you sure you want to delete this game?"
                          onConfirm={() => delItem(g.id)}
                          icon={<DeleteFilled />}
                        >
                          <Button danger icon={<DeleteFilled />} />
                        </Popconfirm>
                      </>
                    ) : undefined}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
        {data?.length && isMore ? (
          <InView as="div" onChange={(inView) => inView && fetchData()}>
            <SkeletonGameList />
          </InView>
        ) : undefined}
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
      </TableContainer>
      <Modal
        title="Update Game"
        open={!!selectedGame}
        onCancel={() => setSelectedGame(undefined)}
        footer={[
          <Button
            key="back"
            onClick={() => setSelectedGame(undefined)}
            disabled={loading}
          >
            Cancel
          </Button>,
          <Button
            disabled={loading}
            loading={loading}
            key="submit"
            htmlType="submit"
            form={formId}
          >
            Update
          </Button>,
        ]}
      >
        <Form
          key={formId}
          id={formId}
          onFinish={updateItem}
          layout="vertical"
          className="p-16"
          initialValues={{
            game: {
              ...selectedGame,
              state: selectedGame?.stateId,
              tags: selectedGame?.gameTags?.map((t) => t.tagId),
              achievements: [
                selectedGame?.obtainedAchievements,
                selectedGame?.totalAchievements,
              ],
            }
          }}
        >
          <Form.Item name="game">
            <InputGame fieldName="game" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GameTable;
