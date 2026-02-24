import {Container, Row, Col} from "react-bootstrap";
import FaqComponent from "../components/FaqComponent";

const SyaratKetenPage = () => {
  return (
    <div className="syarat-ketentuan-page">
      <div className="syarat-ketentuan min-vr-100">
        <Container>
          <Row>
          <Col>
            <h1 className="fw-bold text-center mb-2 animate__animated animate__fadeInUp animate__delay-1s">Syarat & Ketentuan</h1>
            <p className="text-center animate__animated animate__fadeInUp animate__delay-1s">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit voluptates est quaerat voluptatibus inventore ipsum omnis tenetur possimus nihil odit id, cum ratione tempore autem dignissimos? Ratione temporibus ut ea.</p>
          </Col>
          </Row>
          <Row className="pt-5">
            <Col>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. In est ipsam, quibusdam eos dolores inventore. Temporibus, quis enim atque illo eveniet earum odio rem tempora voluptatum ea rerum hic! Asperiores.</p>
            </Col>
          </Row>
          <Row className="py-3">
            <Col>
            <h4 className="fw-bold">1. Lorem</h4>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque dolorum sapiente perferendis illo ullam sed, ab delectus vel optio qui asperiores, corporis quas quidem suscipit facere consequatur quibusdam, aliquid tenetur.</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore laboriosam ad autem ut sint saepe maiores exercitationem omnis quod molestiae excepturi maxime id molestias dolore explicabo, ex, accusamus, quo aut.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum, aliquam, enim id exercitationem itaque nostrum maiores expedita sequi doloremque odit esse eligendi odio aspernatur illum ducimus voluptatum rerum dolores accusamus!</p>
            </Col>
          </Row>
          <Row className="py-3">
            <Col>
            <h4 className="fw-bold">2. Lorem</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem necessitatibus assumenda sapiente dolorum id omnis facere libero. Cumque laboriosam, similique error beatae doloribus dolorum odio molestiae reiciendis et. Aliquam, cumque?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque incidunt dolores perspiciatis nobis illo officiis iusto possimus dolor voluptas. Laboriosam repudiandae quis quidem iusto culpa itaque accusamus, rerum id fuga?</p>
            </Col>
          </Row>
          <Row className="py-3">
            <Col>
            <h4 className="fw-bold">3. Lorem</h4>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad iure quod, neque obcaecati non itaque laborum quaerat excepturi, provident, dolor magni. Commodi, obcaecati repellat aperiam rerum tenetur natus dolorum sunt?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate neque blanditiis repudiandae, maxime ratione tempora et exercitationem, sint aperiam illum eum sunt. Tempore odit debitis laboriosam tempora quae dolor expedita.</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Exercitationem culpa rem sit molestiae cum magnam animi quae hic sequi? Sapiente laudantium tempore magnam unde, libero excepturi vitae sint voluptatibus cum.</p>
            </Col>
          </Row>
        </Container>
      </div>
      <FaqComponent/>
    </div>
  );
};

export default SyaratKetenPage;