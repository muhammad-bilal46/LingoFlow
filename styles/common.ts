import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#00A6FE',
  background: '#FFFFFF',
  text: '#333333',
};

export const common = StyleSheet.create({
  linkContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 10,
},
linkText: {
  color: '#00A6FE',
  fontSize: 14,
  fontWeight: '500',
},
separator: {
  marginHorizontal: 8,
  color: '#999',
},
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
