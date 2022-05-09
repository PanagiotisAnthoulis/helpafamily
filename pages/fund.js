import React from 'react';

import { BLOCKS } from '@contentful/rich-text-types';
import Head from 'next/head';
import { createClient } from 'contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import Card, { CardParagraph } from '../components/Card';
import CardsLayout from '../components/CardsLayout';
import PrimaryLayout from '../components/PrimaryLayout';
// import useStripeSession from '../hooks/useStripeSession';

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_, children) => (
      <CardParagraph>{children}</CardParagraph>
    ),
    [BLOCKS.UL_LIST]: (_, children) => (
      <ul className="list-disc text-left pl-6">
        {children.map(({ key, ...rest }) => {
          const firstChild = rest.props.children[0];
          return <li key={key}>{firstChild.props.children[0]}</li>;
        })}
      </ul>
    ),
  },
};

export async function getStaticProps() {
  const client = createClient({
    environment: process.env.CONTENTFUL_ENVIRONMENT,
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });

  const res = await client.getEntries({
    content_type: 'pageWithCards',
    'fields.slug': 'fund',
  });

  return {
    props: {
      page: res.items[0],
    },
  };
}

// function StripeAction({ amount, text }) {
//   const [handleSubmit, isPending] = useStripeSession();

//   const handleOnClick = () =>
//     handleSubmit({
//       amount,
//       cause: text,
//     });

//   return (
//     <CardAction isPending={isPending} onClick={handleOnClick}>
//       {text}
//     </CardAction>
//   );
// }

// function LocalAction({ link, text }) {
//   return <CardAction linkTo={link}>{text}</CardAction>;
// }

// const renderAction = ({ actionText, actionAmount, actionLink }) => {
//   return actionAmount ? (
//     <StripeAction amount={actionAmount} text={actionText} />
//   ) : (
//     <LocalAction link={actionLink} text={actionText} />
//   );
// };

export default function Home({
  page: {
    fields: { cards },
  },
}) {
  return (
    <>
      <Head>
        <title>
          {'Margarita Humanitarian Foundation - Fund Local Humanitarian Needs'}
        </title>
        <meta
          name="description"
          content="Here's a way to fund your local humanitarian organization in the Antelope Valley."
        />
      </Head>
      <PrimaryLayout>
        <CardsLayout>
          {/* <div className="flex flex-wrap"> */}
          {cards.map((card) => {
            const {
              fields: {
                actionText,
                actionAmount,
                actionLink,
                background: {
                  fields: {
                    file: { url },
                  },
                },
                content: rawRichTextField,
                title,
              },
              sys: { id },
            } = card;
            console.log(rawRichTextField, options);
            return (
              <Card
                action={actionText}
                actionCost={actionAmount}
                backgroundImageSource={`https:${url}`}
                isExternal={true}
                key={id}
                link={actionLink}
                paragraphs={[rawRichTextField.content[0].content[0].value]}
                title={title}
              >
                {documentToReactComponents(rawRichTextField, options)}

                {/* {actionText && */}
              </Card>
            );
          })}
        </CardsLayout>
      </PrimaryLayout>
    </>
  );
}
// renderAction({ actionText, actionAmount, actionLink })}
