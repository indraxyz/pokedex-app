import { useNProgress } from "@tanem/react-nprogress";

import Bar from "./Bar";
import Container from "./Container";
import Spinner from "./Spinner";

type Props = {
  isAnimating: boolean;
};

const Progress = (props: Props) => {
  const { isAnimating } = props;
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
      <Spinner />
    </Container>
  );
};

export default Progress;
