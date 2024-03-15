import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const S = {
  View: styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  PrivacyContainer: styled.div`
    max-width: 800px;
    overflow: auto;
    white-space: pre-line;
    word-wrap: break-word;
  `,
  Typography: styled.h1`
    margin-bottom: 3rem;
  `,
};

const PrivacyPolicy = () => {
  const [privacyText, setPrivacyText] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPrivacyText = async () => {
      try {
        const response = await fetch('/policy.txt');
        const text = await response.text();
        setPrivacyText(text);
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
      }
    };

    fetchPrivacyText();
  }, []);

  return (
    <S.View>
      <Container maxWidth="md">
        <S.Typography>
            Privacy Policy
        </S.Typography>
        <S.PrivacyContainer>
            {privacyText}
        </S.PrivacyContainer>
      </Container>
    </S.View>
  );
};

export default PrivacyPolicy;
