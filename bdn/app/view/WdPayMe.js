/*
 * File: app/view/WdPayMe.js
 *
 * This file was generated by Sencha Architect version 2.2.3.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Bdn.view.WdPayMe', {
    extend: 'Ext.window.Window',
    alias: 'widget.wdpayme',

    draggable: false,
    height: 518,
    itemId: 'wdPayMe',
    width: 717,
    resizable: false,
    layout: {
        align: 'stretch',
        type: 'hbox'
    },
    bodyStyle: 'border:none; background-color: white;',
    closable: false,
    title: '',
    modal: true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    itemId: 'LeftPanel'
                },
                {
                    xtype: 'container',
                    itemId: 'pSingleWallet',
                    padding: 10,
                    width: 518,
                    layout: {
                        type: 'anchor'
                    },
                    items: [
                        {
                            xtype: 'component',
                            html: 'Send BitCoin now...',
                            itemId: 'title',
                            style: 'font-weight:bold; font-size:2.3em;;'
                        },
                        {
                            xtype: 'displayfield',
                            anchor: '100%',
                            itemId: 'lbStatus',
                            margin: '10 20 10 0',
                            fieldLabel: 'Status',
                            labelStyle: 'font-size:1.5em;',
                            labelWidth: 80,
                            value: 'Waiting',
                            fieldStyle: 'font-size:1.5em;'
                        },
                        {
                            xtype: 'container',
                            itemId: 'pPublic',
                            style: 'float:left',
                            layout: {
                                type: 'anchor'
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    anchor: '100%',
                                    padding: 8,
                                    style: 'float:left;text-align:left;font-weight: bold;',
                                    text: 'To Bitcoin Address'
                                },
                                {
                                    xtype: 'tbspacer',
                                    anchor: '100%'
                                },
                                {
                                    xtype: 'container',
                                    itemId: 'qrcode_public',
                                    padding: '13 11 11 11',
                                    style: 'display: inline-block; float: left;'
                                },
                                {
                                    xtype: 'tbspacer',
                                    anchor: '100%'
                                },
                                {
                                    xtype: 'label',
                                    itemId: 'address_public',
                                    padding: 8,
                                    style: 'float:left;text-align:left;font-weight: bold;',
                                    text: 'Public Address'
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            height: 38,
                            layout: {
                                align: 'stretch',
                                type: 'hbox'
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    width: 500
                                },
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    maxWidth: 200,
                                    minWidth: 200,
                                    layout: {
                                        type: 'anchor'
                                    }
                                },
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    width: 500
                                },
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    height: 31,
                                    itemId: 'btCancel',
                                    margin: '0 0 0 10',
                                    text: 'Cancel'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'container',
                    flex: 1,
                    itemId: 'RightPanel'
                }
            ]
        });

        me.callParent(arguments);
    }

});