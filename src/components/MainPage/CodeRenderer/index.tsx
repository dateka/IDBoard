import styled from "@emotion/styled";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import globalStyles from "global.module.scss";
import $ from "jquery";
import React from "react";
import { Shape } from "./types";
import App from "./WebGL_Test/ImageFinal/App";
import Rectangle from "./WebGL_Test/Rectangle";
import Square from "./WebGL_Test/Square";
import Triangle from "./WebGL_Test/Triangle";

const Wrapper = styled.div({
  height: "100%",
  width: "100%",
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  h1: {
    marginLeft: "10px",
    color: `${globalStyles.deeperBurgundy}`,
  },
});

const keyShapeMap: Record<string, Shape> = {
  r: <Rectangle />,
  t: <Triangle />,
  s: <Square />,
  i: <App />,
};

const CodeRenderer = () => {
  const [shape, setShape] = React.useState<Shape>();

  function handleKeyDown({ key }: React.KeyboardEvent<HTMLDivElement>) {
    setShape(keyShapeMap[key.toLowerCase()]);
  }

  let hasGP = false;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repGP;
  function handleClick() {
    console.log("Le lien a été cliqué.");
  }
  function canGame() {
    return "getGamepads" in navigator;
  }
  function reportOnGamepad() {
    var gp = navigator.getGamepads()[0];
    if (gp != null) {
      var html = "";
      html += "id: " + gp.id + "<br/>";

      for (let i = 0; i < gp.buttons.length; i++) {
        html += "Button " + (i + 1) + ": ";
        if (gp.buttons[i].pressed) html += " pressed";
        html += "<br/>";
      }
      for (let i = 0; i < gp.axes.length; i += 2) {
        html +=
          "Stick " +
          (Math.ceil(i / 2) + 1) +
          ": " +
          gp.axes[i] +
          "," +
          gp.axes[i + 1] +
          "<br/>";
      }

      $("#gamepadDisplay").html(html);
    }
  }
  if (canGame()) {
    $(window).on("gamepadconnected", function (e: unknown) {
      console.log("connection event");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      repGP = window.setInterval(reportOnGamepad, 100);

      var gamepad = navigator.getGamepads()[0];
      if (gamepad != null) {
        console.log(gamepad.buttons[0].pressed);
      }
    });
    var checkGP = window.setInterval(function () {
      // console.log("checkGP");
      if (navigator.getGamepads()[0]) {
        if (!hasGP) $(window).trigger("gamepadconnected");
        window.clearInterval(checkGP);
      }
    }, 500);
  }

  return (
    <Wrapper
      tabIndex={0}
      id="gamepadDisplay"
      // Détecte une click de souris
      onClick={() => console.log("cliquer")}
      // Détecte une double click du souris
      onDoubleClick={() => console.log("double cliquer")}
      // Détecte une appui du souris pour moment indéfinis
      onMouseDown={() => console.log("Mouse down")}
      // detecte quand le curser quitte le composant pour aller sur un autre(aucun component enfant)
      onMouseLeave={() => console.log("Mouse leave")}
      // lance l'événement des qu'on va sur un component children (enfant)
      onMouseOut={() => console.log("Mouse out")}
      // Détecte le bouton appuyé
      onKeyDown={(event) => {
        console.log("on key down " + event.key);
        handleKeyDown(event);
      }}
      // Détecte lorsqu'on enlève un bouton
      onKeyUp={(event) => console.log("on key up " + event.key)}
      // Détecte l'évenement des qu'on bouge la souris
      onMouseMove={(event) => console.log("on key move ")}
      // faut souligner du text et puis on le drag
      onDrag={(event) => console.log("on key drag ")}
    >
      {!shape && (
        <div>
          <div style={{ opacity: "20%" }}>
            <FontAwesomeIcon icon={faCode} size="6x" />
            <h1>Start Coding</h1>
          </div>
          <button onClick={handleClick}>Click moi</button>
        </div>
      )}
      {shape && shape}
    </Wrapper>
  );
};
//event.persist();
//console.log(event.key);
export default CodeRenderer;
