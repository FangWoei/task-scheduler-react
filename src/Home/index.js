import { Container, Title, Space, Divider } from "@mantine/core";

import Tasks from "../Tasks";
import Categorys from "../Categorys";

function Home() {
  return (
    <Container>
      <Space h="50px" />
      <Title align="center" color="red">
        Task Scheduler
      </Title>
      <Space h="20px" />
      <Title order={2} align="center">
        Categorys
      </Title>
      <Space h="30px" />
      <Divider />
      <Space h="30px" />
      <Categorys />
      <Space h="20px" />
      <Title order={2} align="center">
        Task
      </Title>
      <Space h="30px" />
      <Divider />
      <Space h="30px" />
      <Tasks />
    </Container>
  );
}

export default Home;
