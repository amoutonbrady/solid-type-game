import { Component, createEffect, createSignal, createState, sample } from 'solid-js';
import { render } from 'solid-js/dom';
import anime from 'animejs';
import { uniqueNamesGenerator, adjectives, animals, colors } from 'unique-names-generator';

const App: Component = () => {
  let $input: HTMLInputElement;
  let $currentWord: HTMLParagraphElement;
  const [input, setInput] = createState({ value: '' });
  const [currentWord, setCurrentWord] = createSignal(generateNextWord());

  createEffect(async () => {
    // Check if the current word has been fulfilled yet
    if (currentWord() !== input.value) return;

    // If that's the case provide a quick use feedback which fades
    // in and out the old word in place for a new word
    const fadeOut = anime({
      targets: $currentWord,
      keyframes: [{ opacity: 1 }, { opacity: 0 }],
      elasticity: 0,
      easing: 'easeInOutQuad',
      duration: 500,
    });

    await fadeOut.finished;

    sample(() => {
      setCurrentWord(generateNextWord());
      setInput('value', '');
    });

    fadeOut.reverse();
    fadeOut.play();
  });

  const handleInput = (e: Event & { target: HTMLInputElement }) => {
    // First we transform the value to uppercase
    const value = e.target.value.toUpperCase();

    // Then we chack if the current word starts with the new value
    if (!currentWord().startsWith(value)) {
      // If that's case we provided feedback to the user
      // in the form of an animation
      anime({
        targets: $input,
        translateX: [
          { value: 0, duration: 80 },
          { value: -10, duration: 80 },
          { value: 10, duration: 80 },
          { value: -10, duration: 80 },
          { value: 10, duration: 80 },
          { value: -10, duration: 80 },
          { value: 10, duration: 80 },
          { value: -8, duration: 80 },
          { value: 8, duration: 80 },
          { value: 0, duration: 80 },
        ],
        elasticity: 1000,
        easing: 'cubicBezier(0.455, 0.030, 0.515, 0.955)',
      });
    } else {
      // Otherwise we set the input to the new value which is correct
      setInput({ value });
    }

    // HACK: This is hack to force the prevent the input to be filled if the
    // value doesn't match the current word
    $input.value = input.value;
  };

  return (
    <>
      <h1 class="text-xl text-center font-semibold">Solid Typing Game</h1>
      <p class="text-center mt-2">Go ahead and type the following word:</p>

      <p
        ref={$currentWord}
        class="text-black text-center mt-1"
        innerHTML={highlightWord(currentWord(), input.value)}
      ></p>

      <input
        ref={$input}
        value={input.value}
        class="border border-black rounded px-8 py-4 uppercase text-lg mt-8"
        onInput={handleInput}
      />
    </>
  );
};

render(() => App, document.getElementById('app'));

function generateNextWord() {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    style: 'upperCase',
    separator: ' ',
  });
}

function highlightWord(word: string, substr: string) {
  return substr ? word.replace(substr, `<span class="text-blue-700">${substr}</span>`) : word;
}
