import 'package:client_shared/config.dart';
import 'package:flutter/material.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:client_shared/components/back_button.dart';
import 'package:client_shared/wallet/wallet_card_view.dart';
import 'package:client_shared/wallet/wallet_activity_item_view.dart';

import 'package:rail/generated/l10n.dart';
import 'package:rail/wallet/add_credit_sheet_view.dart';
import '../graphql/generated/graphql_api.graphql.dart';
import '../query_result_view.dart';

class WalletView extends StatefulWidget {
  const WalletView({Key? key}) : super(key: key);

  @override
  State<WalletView> createState() => _WalletViewState();
}

class _WalletViewState extends State<WalletView> {
  int? selectedWalletIndex;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Query(
          options: QueryOptions(document: WALLET_QUERY_DOCUMENT),
          builder: (QueryResult result,
              {Refetch? refetch, FetchMore? fetchMore}) {
            if (result.isLoading || result.hasException) {
              return QueryResultView(result);
            }
            final query = Wallet$Query.fromJson(result.data!);
            final wallet = query.riderWallets;
            final transactions = query.riderTransacions.edges;
            if (wallet.isNotEmpty && selectedWalletIndex == null) {
              selectedWalletIndex = 0;
            }
            final currentWallet =
                wallet.isEmpty ? null : wallet[selectedWalletIndex ?? 0];
            return SafeArea(
              minimum: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const railBackButton(),
                  WalletCardView(
                    currency: currentWallet?.currency ?? defaultCurrency,
                    credit: currentWallet?.balance ?? 0,
                    onAdddCredit: () {
                      showModalBottomSheet(
                          context: context,
                          isScrollControlled: true,
                          constraints: const BoxConstraints(maxWidth: 600),
                          builder: (context) {
                            return AddCreditSheetView(
                              currency:
                                  currentWallet?.currency ?? defaultCurrency,
                            );
                          });
                    },
                  ),
                  const SizedBox(height: 32),
                  Text(S.of(context).wallet_activities_heading,
                      style: Theme.of(context).textTheme.headlineMedium),
                  const SizedBox(height: 12),
                  if (transactions.isNotEmpty)
                    Expanded(
                      child: ListView.builder(
                          itemCount: transactions.length,
                          itemBuilder: (context, index) {
                            final item = transactions[index].node;
                            return WalletActivityItemView(
                              title: item.action == TransactionAction.recharge
                                  ? getRechargeText(item.rechargeType!)
                                  : getDeductText(context, item.deductType!),
                              dateTime: item.createdAt,
                              amount: item.amount,
                              currency: item.currency,
                              icon: getTransactionIcon(item),
                            );
                          }),
                    ),
                  if (transactions.isEmpty)
                    Expanded(
                        child: Center(
                            child: Text(
                                S.of(context).wallet_empty_state_message))),
                ],
              ),
            );
          }),
    );
  }

  String getDeductText(
      BuildContext context, RiderDeductTransactionType deductType) {
    switch (deductType) {
      case RiderDeductTransactionType.orderFee:
        return S.of(context).enum_rider_transaction_deduct_order_fee;

      case RiderDeductTransactionType.withdraw:
        return S.of(context).enum_rider_transaction_deduct_withdraw;

      case RiderDeductTransactionType.correction:
        return S.of(context).enum_rider_transaction_deduct_correction;
      default:
        return S.of(context).enum_unknown;
    }
  }

  String getRechargeText(RiderRechargeTransactionType type) {
    switch (type) {
      case RiderRechargeTransactionType.bankTransfer:
        return S.of(context).enum_rider_transaction_recharge_bank_transfer;

      case RiderRechargeTransactionType.correction:
        return S.of(context).enum_rider_transaction_recharge_correction;

      case RiderRechargeTransactionType.gift:
        return S.of(context).enum_rider_transaction_recharge_gift;

      case RiderRechargeTransactionType.inAppPayment:
        return S.of(context).enum_rider_transaction_recharge_in_app_payment;

      default:
        return S.of(context).enum_unknown;
    }
  }

  IconData getTransactionIcon(
      Wallet$Query$RiderTransacionConnection$RiderTransacionEdge$RiderTransacion
          transacion) {
    if (transacion.action == TransactionAction.recharge) {
      switch (transacion.rechargeType) {
        case RiderRechargeTransactionType.bankTransfer:
          return Ionicons.business;

        case RiderRechargeTransactionType.gift:
          return Ionicons.gift;

        case RiderRechargeTransactionType.correction:
          return Ionicons.refresh;

        case RiderRechargeTransactionType.inAppPayment:
          return Ionicons.receipt;

        default:
          return Ionicons.help;
      }
    } else {
      switch (transacion.deductType) {
        case RiderDeductTransactionType.orderFee:
          return Ionicons.car;

        default:
          return Ionicons.help;
      }
    }
  }
}
