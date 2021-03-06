import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router';
import { mount } from 'enzyme';
import expect from 'expect';
import { Documents } from '../Documents';

import { doc } from './fixtures';

function setup(documents=[doc]) {
  const actions = {
    fetchCollection: expect.createSpy(),
    deleteDocument: expect.createSpy(),
    search: expect.createSpy()
  };

  const props = {
    documents,
    params: { collection_name: 'movies' },
    isFetching: false
  };

  const component = mount(<Documents {...actions} {...props} />);

  return {
    component: component,
    actions: actions,
    h1: component.find('h1').last(),
    new_button: component.find('.page-buttons a').first(),
    row_title: component.find('strong a'),
    table: component.find('.content-table')
  };
}

describe('Containers::Documents', () => {
  it('should render correctly', () => {
    const { component, h1, new_button } = setup();
    expect(h1.text()).toBe('Movies');
    expect(new_button.text()).toBe('New document');
    component.setProps({params: {collection_name: "posts"}});
    expect(new_button.text()).toBe('New post');
  });

  it('should render correctly when there are not any documents', () => {
    const { component, table, h1 } = setup([]);
    const compProps = component.props();
    expect(table.node).toNotExist();
    expect(h1.text()).toBe(`No documents found.`);
  });

  it('should show slug if title is empty', () => {
    const { component, row_title } = setup([Object.assign({}, doc, {
      title: ''
    })]);
    expect(row_title.text()).toBe(doc.slug);
  });

  it('should call fetchDocuments action after mounted', () => {
    const { actions } = setup();
    expect(actions.fetchCollection).toHaveBeenCalled();
  });

  it('should fetch documents again when params change', () => {
    const { component, actions } = setup();
    component.setProps({params: {collection_name: "puppies"}});
    expect(actions.fetchCollection.calls.length).toBe(2);
  });
});
