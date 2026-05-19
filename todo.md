# DeliveryGo - TODO

## Fase 1: Autenticação e Modelos Base
- [x] Sistema de autenticação (login/cadastro) - Manus OAuth
- [x] Modelos de dados: User, Restaurant, Delivery, Order, Product, Commission - 13 tabelas criadas
- [x] Roles: customer, restaurant, delivery, admin - Implementado em schema
- [x] Estrutura de API base - tRPC com Express

## Fase 2: Frontend - Páginas Principais
- [x] Home page com busca e categorias - Implementada com design vermelho/branco
- [x] Página de restaurantes por categoria - Search.tsx criada
- [x] Página de detalhes do restaurante e cardápio - Restaurant.tsx com modal
- [x] Carrinho de compras - Gerenciamento com useState
- [x] Checkout com cálculo de comissão - Checkout.tsx com comissão R$10

## Fase 3: Sistema de Pagamento e Comissão
- [x] Integração NBPay com Pix - Webhook endpoint criado
- [x] Cálculo automático de comissão (R$10 por pedido) - Lógica implementada
- [x] Exibição de comissão no checkout - Componente pronto
- [x] Webhooks para confirmar pagamento Pix - /api/webhooks/nbpay
- [x] Sistema de repasse automático ao restaurante - Procedure criada

## Fase 4: Painel do Restaurante
- [ ] Dashboard com estatísticas
- [ ] Adicionar/editar produtos
- [ ] Atualizar preços
- [ ] Ver pedidos recebidos
- [ ] Aceitar/rejeitar pedidos
- [ ] Visualizar faturamento bruto, comissão e valor final

## Fase 5: Painel do Entregador
- [ ] Listar entregas disponíveis
- [ ] Aceitar entrega
- [ ] Visualizar rota (Google Maps)
- [ ] Marcar como entregue
- [ ] Histórico de entregas

## Fase 6: Painel Administrativo
- [ ] Dashboard com métricas gerais
- [ ] Visualizar total de comissões
- [ ] Visualizar pedidos realizados
- [ ] Visualizar valor repassado aos restaurantes
- [ ] Gerenciar usuários, restaurantes, entregadores
- [ ] Histórico financeiro completo

## Fase 7: Rastreamento e Notificações
- [ ] Sistema de status de pedido (pendente, confirmado, em preparo, saiu para entrega, entregue)
- [ ] Rastreamento em tempo real
- [ ] Notificações para cliente, restaurante e entregador

## Fase 8: Avaliações e Cupons
- [ ] Sistema de avaliações (cliente avalia restaurante/entregador)
- [ ] Criar e gerenciar cupons de desconto
- [ ] Aplicar cupons no checkout

## Fase 9: Design e Responsividade
- [ ] Design mobile-first em vermelho e branco
- [ ] Responsividade completa
- [ ] Testes gerais de UX

## Fase 10: Segurança e Testes
- [ ] Validação de pagamentos antes do repasse
- [ ] Registro de todas as transações
- [ ] Testes unitários e de integração
- [ ] Testes de segurança
